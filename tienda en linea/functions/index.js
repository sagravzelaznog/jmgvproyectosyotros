const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("sk_test_REEMPLAZAR_POR_TU_CLAVE_SECRETA_STRIPE");

admin.initializeApp();
const db = admin.firestore();

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
    // Verificación de Autenticación
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated", 
            "Acceso denegado: Inicia sesión para realizar una compra segura."
        );
    }

    const cartItems = data.cart; 
    if (!cartItems || cartItems.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "El carrito está vacío.");
    }

    // Reconstrucción de la verdad (Zero Trust)
    const line_items = [];
    
    for (const item of cartItems) {
        const productRef = db.collection("productos").doc(item.id);
        const productSnap = await productRef.get();

        if (!productSnap.exists || productSnap.data().activo === false) {
            throw new functions.https.HttpsError(
                "not-found", 
                `El producto con ID ${item.id} no está disponible.`
            );
        }

        const productData = productSnap.data();

        if (productData.stock < item.cantidad) {
            throw new functions.https.HttpsError(
                "out-of-range", 
                `Infracción de inventario: Solo quedan ${productData.stock} uds de ${productData.nombre}.`
            );
        }

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: productData.nombre,
                    images: productData.imagenUrl ? [productData.imagenUrl] : [],
                },
                unit_amount: Math.round(productData.precio * 100), 
            },
            quantity: item.cantidad,
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            metadata: {
                usuarioId: context.auth.uid,
                cartPayload: JSON.stringify(cartItems) 
            },
            success_url: "https://tutienda.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://tutienda.com/",
        });

        return { url: session.url };
        
    } catch (error) {
        console.error("Auditoría Stripe Error:", error);
        throw new functions.https.HttpsError("internal", "Error de comunicación con la pasarela bancaria.");
    }
});
