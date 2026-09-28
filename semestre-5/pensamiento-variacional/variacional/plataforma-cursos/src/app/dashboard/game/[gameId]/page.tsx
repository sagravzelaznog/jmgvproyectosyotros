"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function GamePage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Hook para recibir progreso desde el iframe del juego
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validar que el mensaje venga del juego y sea de tipo SAVE_PROGRESS
      if (event.data && event.data.type === 'SAVE_PROGRESS' && user && gameId) {
        try {
          const token = await user.getIdToken();
          await fetch('/api/user/save-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              lessonId: gameId as string, // El gameId actuará como lessonId
              score: event.data.score,
              total: event.data.total
            })
          });
          console.log("✅ Progreso del juego guardado en la BD principal.");
        } catch (error) {
          console.error("❌ Error guardando progreso del juego:", error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, gameId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header flotante */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center z-10 sticky top-0">
        <Link 
          href="/dashboard" 
          className="text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          VOLVER AL DASHBOARD
        </Link>
        <div className="text-slate-300 font-semibold hidden md:block">
          Modo Juego: {gameId}
        </div>
      </div>

      {/* Contenedor del Iframe */}
      <div className="flex-1 w-full h-[calc(100vh-65px)] bg-black relative">
        <iframe
          src={`/games/${gameId}/index.html?uid=${user.uid}`}
          className="absolute inset-0 w-full h-full border-none"
          title={`Juego ${gameId}`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
