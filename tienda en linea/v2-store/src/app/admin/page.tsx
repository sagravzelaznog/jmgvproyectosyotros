"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Shield, PlusCircle, LogOut, Package, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_EMAILS = [
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "primomanuel@hotmail.com",
    "primomanuelsagrav@gmail.com"
];

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState("");

    // Form state
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{msg: string, type: "success"|"error"} | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (u) {
                if (u.email && ADMIN_EMAILS.includes(u.email)) {
                    setUser(u);
                    setAuthError("");
                } else {
                    setAuthError(`Acceso denegado para: ${u.email}`);
                    await signOut(auth);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const fileExt = file.name.split('.').pop();
            const safeFileName = `producto_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const storageRef = ref(storage, `imagenes_catalogo/${safeFileName}`);

            const uploadTask = await uploadBytesResumable(storageRef, file);
            const imageUrl = await getDownloadURL(uploadTask.ref);

            const docRef = await addDoc(collection(db, "productos"), {
                nombre: nombre,
                descripcion: descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock, 10),
                imagenUrl: imageUrl,
                activo: true,
                fechaCreacion: serverTimestamp()
            });

            setFeedback({ msg: `¡Producto añadido! ID: ${docRef.id}`, type: "success" });
            setNombre("");
            setPrecio("");
            setStock("");
            setDescripcion("");
            setFile(null);
        } catch (error: any) {
            console.error("Error al inyectar datos:", error);
            setFeedback({ msg: `Error: ${error.message}`, type: "error" });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    if (loadingAuth) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-emerald-900/20 blur-3xl" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 flex flex-col items-center p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
                    <Shield className="w-20 h-20 text-blue-500 mb-6" />
                    <h2 className="text-3xl font-bold tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Acceso Administrativo</h2>
                    <button onClick={handleGoogleLogin} className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all flex items-center mb-4">
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Iniciar sesión con Google
                    </button>
                    {authError && <p className="text-rose-400 mt-2 font-semibold text-center">{authError}</p>}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 font-sans">
            <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold flex items-center"><Shield className="text-emerald-400 mr-2" /> Secure<span className="text-blue-500">Admin</span></h1>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <div className="px-4 py-3 bg-blue-600/20 text-blue-400 rounded-xl font-semibold flex items-center">
                        <PlusCircle className="w-5 h-5 mr-3" /> Nuevo Producto
                    </div>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="mb-4 px-4 text-xs text-slate-500 truncate">{user.email}</div>
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all flex items-center justify-center font-medium">
                        <LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="flex-grow p-8 md:p-12 overflow-y-auto">
                <header className="mb-10">
                    <h2 className="text-4xl font-bold text-white mb-2">Alta de Catálogo</h2>
                    <p className="text-slate-400">Sincronización directa con Firestore y Firebase Storage</p>
                </header>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 max-w-4xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre del Producto</label>
                            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full bg-slate-950/50 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-600" placeholder="Ej. Lente Premium" />
                        </div>

                        <div className="col-span-full md:col-span-1 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Precio Fijo (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 font-bold">$</span>
                                    <input type="number" step="0.01" min="0" value={precio} onChange={e => setPrecio(e.target.value)} required className="w-full bg-slate-950/50 pl-8 pr-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="0.00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Stock Inicial</label>
                                <input type="number" min="1" value={stock} onChange={e => setStock(e.target.value)} required className="w-full bg-slate-950/50 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="10" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Descripción Detallada</label>
                            <textarea rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} required className="w-full bg-slate-950/50 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-white" placeholder="Escribe los detalles del producto..."></textarea>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Fotografía (Archivo Seguro)</label>
                            <label className="mt-1 flex flex-col items-center justify-center px-6 py-12 border-2 border-slate-700 border-dashed rounded-2xl bg-slate-950/30 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer group">
                                <Package className="w-12 h-12 text-slate-500 group-hover:text-blue-400 mb-3 transition-colors" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-blue-400">{file ? file.name : "Haz clic para seleccionar un archivo"}</span>
                                <span className="text-xs text-slate-500 mt-1">PNG o JPG hasta 2MB</span>
                                <input type="file" accept="image/png, image/jpeg" onChange={e => setFile(e.target.files?.[0] || null)} required className="hidden" />
                            </label>
                        </div>

                        <div className="col-span-full pt-4">
                            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-all duration-300 flex justify-center items-center group">
                                {isSubmitting ? (
                                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3" /> Inyectando a Firestore...</>
                                ) : (
                                    <><Database className="mr-2 group-hover:scale-110 transition-transform" /> Inyectar a Firestore</>
                                )}
                            </button>
                        </div>
                        
                        <AnimatePresence>
                            {feedback && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`col-span-full p-4 rounded-xl font-medium text-center shadow-lg border ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                    {feedback.msg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
