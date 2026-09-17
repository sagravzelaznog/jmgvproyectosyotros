const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Se asume que STRIPE_SECRET_KEY está configurada en las variables de entorno de Firebase Functions
// mediante `firebase functions:secrets:set STRIPE_SECRET_KEY`
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_PLACEHOLDER_SOLO_PARA_INTELISENSE");

// Inicializamos Admin SDK para evadir las reglas de firestore.rules
admin.initializeApp();
const db = admin.firestore();

/**
 * ============================================================================
 * CLOUD FUNCTION 1: createPaymentIntent (Callable)
 * Genera la orden y el intent de cobro.
 * Arquitectura de Confianza Cero: Todo cálculo monetario ocurre aquí.
 * ============================================================================
 */
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  // 1. AUDITORÍA: El usuario debe estar autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Violación de seguridad: El usuario debe iniciar sesión para procesar un pago.'
    );
  }

  const uid = context.auth.uid;
  const cartItems = data.cartItems; // Formato esperado: [{ productId: 'abc', quantity: 2 }]

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Payload inválido o carrito vacío.');
  }

  let subtotal = 0;
  const orderItems = [];

  // 2. PREVENCIÓN DE CLIENT-SIDE SPOOFING: 
  // Iteramos sobre los IDs y sacamos el precio real desde la Base de Datos segura.
  for (const item of cartItems) {
    const productDoc = await db.collection("products").doc(item.productId).get();
    
    if (!productDoc.exists) {
      throw new functions.https.HttpsError('not-found', `Intento de compra de producto inexistente (${item.productId}).`);
    }

    const productData = productDoc.data();
    
    // Verificamos si sigue activo
    if (productData.isActive !== true) {
      throw new functions.https.HttpsError('failed-precondition', `El producto ${productData.name} ha sido deshabilitado.`);
    }

    // Verificamos stock mínimo (básico)
    if (productData.stock < item.quantity) {
      throw new functions.https.HttpsError('out-of-range', `Inventario insuficiente para ${productData.name}.`);
    }

    // Aritmética financiera segura en el servidor
    subtotal += productData.price * item.quantity;

    // Congelamos (Snapshot) los datos del producto en la Orden para conservar historial
    orderItems.push({
      productId: item.productId,
      name: productData.name,
      priceAtPurchase: productData.price,
      quantity: item.quantity
    });
  }

  // 3. CÁLCULO DE TOTALES
  const taxRate = 0.16; // 16% IVA
  const tax = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + tax; // Todo en centavos

  try {
    // 4. PASARELA DE PAGO: Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'mxn',
      metadata: { 
        userId: uid,
        tipo: 'ecommerce_purchase'
      },
    });

    // 5. REGISTRO EN BASE DE DATOS (Orden en estado 'pending')
    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      id: orderRef.id,
      userId: uid,
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      shippingCost: 0,
      totalAmount: totalAmount,
      status: 'pending', // Bloqueado. Ningún cliente puede alterar esto.
      paymentIntentId: paymentIntent.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 6. RESPUESTA AL CLIENTE
    return {
      clientSecret: paymentIntent.client_secret,
      orderId: orderRef.id
    };

  } catch (error) {
    console.error("[CRÍTICO] Fallo en integración con Stripe:", error);
    throw new functions.https.HttpsError('internal', 'Error procesando la transacción financiera.');
  }
});


/**
 * ============================================================================
 * CLOUD FUNCTION 2: stripeWebhook (HTTP Endpoint)
 * Escucha eventos de red emitidos por los servidores de Stripe.
 * Este es el ÚNICO lugar autorizado para cambiar una orden a 'paid'.
 * ============================================================================
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    // Validación Criptográfica de la firma de Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ [SECURITY WARN] Firma de Webhook Inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el pago exitoso
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Buscar la orden dueña de este Payment Intent
    const ordersQuery = await db.collection("orders")
                                .where("paymentIntentId", "==", paymentIntent.id)
                                .limit(1)
                                .get();
    
    if (!ordersQuery.empty) {
      const orderDoc = ordersQuery.docs[0];
      const orderData = orderDoc.data();
      
      // Actualización atómica del estado y deducción de stock
      const batch = db.batch();
      
      // 1. Cambiar estado a 'paid'
      batch.update(orderDoc.ref, {
        status: 'paid',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Descontar Inventario Real
      for (const item of orderData.items) {
        const productRef = db.collection("products").doc(item.productId);
        batch.update(productRef, {
          stock: admin.firestore.FieldValue.increment(-item.quantity)
        });
      }

      await batch.commit();
      console.log(`✅ Orden ${orderDoc.id} pagada. Inventario deducido.`);
    } else {
      console.error(`❌ [CRÍTICO] Se recibió pago del Intent ${paymentIntent.id} pero no existe orden asociada.`);
    }
  }

  // Responder 200 a Stripe para confirmar recepción
  res.json({received: true});
});

/**
 * ============================================================================
 * CLOUD FUNCTION 3: bulkUploadProducts (Callable)
 * Sube un catálogo de productos masivo saltándose las reglas de cliente.
 * IMPORTANTE: Para producción real, se debe requerir el Custom Claim 'admin'.
 * ============================================================================
 */
exports.bulkUploadProducts = functions.https.onCall(async (data, context) => {
  // Para fines de esta demostración y tu despliegue actual, 
  // permitimos la subida sin Auth estricto. En producción, descomenta esto:
  /*
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Solo administradores.');
  }
  */

  const products = data.products;
  if (!products || !Array.isArray(products)) {
    throw new functions.https.HttpsError('invalid-argument', 'Formato de productos inválido.');
  }

  const batch = db.batch();
  const collectionRef = db.collection("products");

  let count = 0;
  for (const prod of products) {
    const docRef = collectionRef.doc(); // Genera un ID automático
    batch.set(docRef, {
      id: docRef.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      category: prod.category,
      images: prod.images,
      isActive: prod.isActive,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    count++;
  }

  await batch.commit();
  console.log(`✅ [ADMIN] Importación exitosa de ${count} productos.`);
  
  return { success: true, count: count };
});
