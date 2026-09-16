"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ShoppingCart, Package, X, Shield, Plus, Minus, UserShield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";

interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenUrl: string;
    activo: boolean;
}

interface CartItem extends Product {
    quantity: number;
}

export default function StoreFront() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [error, setError] = useState("");

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "productos"), where("activo", "==", true));
                const querySnapshot = await getDocs(q);
                const fetchedProducts: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
                });
                setProducts(fetchedProducts);
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError("Error de Acceso o de Red. No se pudo cargar el catálogo.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
            <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
                
                {/* Navbar */}
                <nav className="fixed w-full z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex justify-between items-center px-6 py-4 shadow-2xl">
                    <div className="text-2xl font-bold tracking-tighter text-blue-500 flex items-center">
                        <Shield className="mr-2 text-emerald-400 w-8 h-8" /> Secure<span className="text-white">Store</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/admin" className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center group">
                            <UserShield className="mr-2 w-4 h-4 group-hover:text-blue-400 transition-colors" /> Admin
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-300 hover:text-white hover:scale-110 transition-all">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-blue-600 to-blue-400 border-2 border-slate-950 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Hero / Header */}
                <header className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 relative z-10">
                        Tecnología <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Sin Límites</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium relative z-10">
                        Descubre nuestra selección curada de productos con la máxima seguridad y calidad garantizada.
                    </motion.p>
                </header>

                {/* Product Grid */}
                <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-rose-950/20 rounded-3xl border border-rose-500/30">
                            <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                            <p className="text-rose-400 font-bold text-xl">{error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
                            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium">Catálogo vacío o en mantenimiento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: i * 0.05 }}
                                    key={product.id} 
                                    className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-900/20 transition-all group flex flex-col"
                                >
                                    <div className="h-64 overflow-hidden relative bg-slate-800/50 p-4">
                                        <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-300 z-10 border border-slate-800">
                                            Stock: {product.stock}
                                        </div>
                                        <img src={product.imagenUrl} alt={product.nombre} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{product.nombre}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{product.descripcion}</p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-2xl font-black text-emerald-400">${product.precio.toFixed(2)}</span>
                                            <button 
                                                onClick={() => addToCart(product)}
                                                className="bg-slate-800 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors shadow-lg hover:shadow-blue-500/30"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Cart Sidebar Overlay */}
                <AnimatePresence>
                    {isCartOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                                onClick={() => setIsCartOpen(false)}
                                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50" 
                            />
                            <motion.aside 
                                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-800"
                            >
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                                    <h2 className="text-2xl font-bold flex items-center">
                                        <ShoppingCart className="mr-3 text-blue-400" /> Tu Orden
                                    </h2>
                                    <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-70">
                                            <ShoppingCart className="w-16 h-16 mb-4" />
                                            <p className="font-medium text-lg">El carrito está vacío</p>
                                        </div>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.id} className="flex items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                                <img src={item.imagenUrl} alt={item.nombre} className="w-16 h-16 object-contain rounded-xl bg-slate-800 mr-4 p-1" />
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-white text-sm line-clamp-1">{item.nombre}</h4>
                                                    <p className="text-emerald-400 font-bold">${item.precio.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center bg-slate-800 rounded-lg ml-4">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-slate-300 hover:text-white"><Minus className="w-4 h-4" /></button>
                                                    <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-slate-300 hover:text-white"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-slate-400 font-medium">Total Estimado</span>
                                            <span className="text-3xl font-black text-white">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="relative z-0">
                                            <PayPalButtons 
                                                style={{ layout: "vertical", color: "blue", shape: "pill" }}
                                                forceReRender={[cartTotal]}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        intent: "CAPTURE",
                                                        purchase_units: [{
                                                            amount: {
                                                                currency_code: "USD",
                                                                value: cartTotal.toFixed(2)
                                                            }
                                                        }]
                                                    });
                                                }}
                                                onApprove={async (data, actions) => {
                                                    if(actions.order) {
                                                        const details = await actions.order.capture();
                                                        alert("¡Pago Exitoso por " + details.payer?.name?.given_name + "!");
                                                        setCart([]);
                                                        setIsCartOpen(false);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </PayPalScriptProvider>
    );
}
