// firebase-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js";

// ============================================================================
// 1. CONFIGURACIÓN FIREBASE E INICIALIZACIÓN
// ============================================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgff6aAePcokXYUmissb3tzItNpKzJeEE",
    authDomain: "tienda-sagravzelaznog.firebaseapp.com",
    projectId: "tienda-sagravzelaznog",
    storageBucket: "tienda-sagravzelaznog.firebasestorage.app",
    messagingSenderId: "414938323069",
    appId: "1:414938323069:web:2b166414a337f44f123914",
    measurementId: "G-WHS4B058P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// ============================================================================
// 2. MOTOR DE ESTADO LOCAL DEL CARRITO (En Memoria)
// ============================================================================
let cart = [];

const DOM = {
    productGrid: document.getElementById('productGrid'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartItemsContainer: document.getElementById('cartItems'),
    cartCount: document.getElementById('cartCount'),
    cartTotal: document.getElementById('cartTotal'),
    paypalContainer: document.getElementById('paypal-button-container'),
    emptyCartMessage: document.getElementById('emptyCartMessage')
};

// ============================================================================
// 3. CONTROLADORES DE INTERFAZ (UI)
// ============================================================================
const toggleCart = (show) => {
    if (show) {
        DOM.cartSidebar.classList.remove('translate-x-full');
        DOM.cartOverlay.classList.remove('hidden');
    } else {
        DOM.cartSidebar.classList.add('translate-x-full');
        DOM.cartOverlay.classList.add('hidden');
    }
};

document.getElementById('cartToggle').addEventListener('click', () => toggleCart(true));
document.getElementById('closeCart').addEventListener('click', () => toggleCart(false));
DOM.cartOverlay.addEventListener('click', () => toggleCart(false));

// ============================================================================
// 4. LECTURA SEGURA DE LA BASE DE DATOS
// ============================================================================
async function initStorefront() {
    try {
        const q = query(collection(db, "productos"), where("activo", "==", true));
        const querySnapshot = await getDocs(q);

        DOM.productGrid.innerHTML = '';

        if (querySnapshot.empty) {
            DOM.productGrid.innerHTML = `
                <div class="col-span-full text-center py-10 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <i class="fas fa-box-open text-4xl text-slate-500 mb-3"></i>
                    <p class="text-slate-400">Catálogo vacío o en mantenimiento.</p>
                </div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            renderProductCard({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error("Alerta de Seguridad o Red:", error);
        DOM.productGrid.innerHTML = `
            <div class="col-span-full text-center py-10 bg-red-900/20 rounded-2xl border border-red-500/30">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-3"></i>
                <p class="text-red-400 font-bold">Error de Acceso</p>
                <p class="text-slate-400 text-sm mt-2">La lectura fue denegada por las reglas de seguridad o hay un fallo de red.</p>
            </div>`;
    }
}

function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = "bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col group hover:border-blue-500/50 transition-colors duration-300";

    const imgUrl = product.imagenUrl || 'https://images.unsplash.com/photo-1550009158-9ebf6d1736eb?auto=format&fit=crop&w=500&q=80';

    card.innerHTML = `
        <div class="relative h-56 overflow-hidden bg-slate-900">
            <img src="${imgUrl}" alt="${product.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100">
            ${product.stock < 10 ? `<span class="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg">Solo ${product.stock} restantes</span>` : ''}
        </div>
        <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-white mb-2 leading-tight">${product.nombre}</h3>
            <p class="text-sm text-slate-400 mb-6 flex-grow line-clamp-2">${product.descripcion}</p>
            
            <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-700/50">
                <div class="flex flex-col">
                    <span class="text-xs text-slate-500 uppercase tracking-wider mb-1">Precio</span>
                    <span class="text-2xl font-black text-emerald-400 leading-none">$${product.precio.toFixed(2)}</span>
                </div>
                <button onclick="window.addToCart('${product.id}', '${product.nombre.replace(/'/g, "\\'")}', ${product.precio}, ${product.stock})" class="h-12 w-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center transform hover:-translate-y-1">
                    <i class="fas fa-cart-plus text-lg"></i>
                </button>
            </div>
        </div>
    `;
    DOM.productGrid.appendChild(card);
}

// ============================================================================
// 5. LÓGICA DE NEGOCIO DEL CARRITO
// ============================================================================
window.addToCart = (id, nombre, precio, maxStock) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        if (existingItem.cantidad < maxStock) existingItem.cantidad += 1;
        else alert('Has alcanzado el límite de stock para este producto.');
    } else {
        cart.push({ id, nombre, precio, cantidad: 1, maxStock });
    }
    updateCartEngine();
    toggleCart(true);
};

window.updateQuantity = (id, delta) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    const newQty = item.cantidad + delta;
    if (newQty <= 0) {
        cart = cart.filter(i => i.id !== id);
    } else if (newQty <= item.maxStock) {
        item.cantidad = newQty;
    }
    updateCartEngine();
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartEngine();
};

function updateCartEngine() {
    DOM.cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        DOM.emptyCartMessage.style.display = 'flex';
        if (DOM.paypalContainer) DOM.paypalContainer.style.display = 'none';
    } else {
        DOM.emptyCartMessage.style.display = 'none';
        if (DOM.paypalContainer) DOM.paypalContainer.style.display = 'block';

        cart.forEach(item => {
            totalAmount += (item.precio * item.cantidad);
            totalItems += item.cantidad;

            const itemNode = document.createElement('div');
            itemNode.className = "flex gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 relative group";
            itemNode.innerHTML = `
                <div class="flex-grow flex flex-col justify-center">
                    <h4 class="text-sm font-bold text-white mb-1 pr-6 leading-tight">${item.nombre}</h4>
                    <span class="text-emerald-400 font-semibold text-sm">$${item.precio.toFixed(2)}</span>
                </div>
                
                <div class="flex flex-col items-end justify-between">
                    <button onclick="window.removeFromCart('${item.id}')" class="text-slate-500 hover:text-rose-400 transition-colors absolute top-4 right-4">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    
                    <div class="flex items-center space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-700 mt-6">
                        <button onclick="window.updateQuantity('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"><i class="fas fa-minus text-[10px]"></i></button>
                        <span class="w-6 text-center text-sm font-bold text-white">${item.cantidad}</span>
                        <button onclick="window.updateQuantity('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"><i class="fas fa-plus text-[10px]"></i></button>
                    </div>
                </div>
            `;
            DOM.cartItemsContainer.appendChild(itemNode);
        });
    }

    DOM.cartCount.textContent = totalItems;
    DOM.cartCount.classList.add('scale-150');
    setTimeout(() => DOM.cartCount.classList.remove('scale-150'), 200);
    DOM.cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
}

// ============================================================================
// 6. INTEGRACIÓN DE PAGO (PAYPAL FRONTEND)
// ============================================================================
if (window.paypal) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            const totalAmount = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalAmount.toFixed(2)
                    },
                    description: "Compra en SecureStore"
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Pago completado por ' + details.payer.name.given_name + '. ¡Gracias por tu compra!');
                cart = [];
                updateCartEngine();
                toggleCart(false);
            });
        },
        onError: function(err) {
            console.error('Error de PayPal:', err);
            alert('Ocurrió un error al procesar el pago con PayPal.');
        }
    }).render('#paypal-button-container');
}

initStorefront();
