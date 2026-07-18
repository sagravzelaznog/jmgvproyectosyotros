"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Crear documento con 24 horas de acceso
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          hasAccess: true,
          expiresAt: expiresAt,
          createdAt: new Date().toISOString()
        });
      }
      router.push("/dashboard"); // Redirigimos al dashboard después del login
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <h2 className="text-3xl font-bold text-center relative z-10">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>
          <p className="mt-2 text-center text-slate-300 relative z-10">
            Pensamiento Variacional I
          </p>
          
          {!isLogin && (
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl relative z-10 text-center shadow-lg">
              <span className="text-xl">🎁</span>
              <p className="text-sm font-medium text-indigo-200 mt-1">
                Regístrate hoy y obtén 24 horas de acceso gratuito
              </p>
            </div>
          )}
        </div>
        
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70"
            >
              {loading ? "Cargando..." : (isLogin ? "Iniciar Sesión" : "Registrarse")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
            >
              {isLogin 
                ? "¿No tienes cuenta? Regístrate aquí" 
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
