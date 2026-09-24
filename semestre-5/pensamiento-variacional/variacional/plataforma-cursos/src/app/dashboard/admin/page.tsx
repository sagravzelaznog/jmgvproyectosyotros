"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [grantedUsers, setGrantedUsers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/grant-access', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setGrantedUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !user) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: `¡Acceso otorgado! Contraseña temporal para ${data.email}: ${data.password}` });
        setEmail("");
        fetchUsers(); // Recargar lista
      } else {
        setMessage({ type: "error", text: data.error || "Error desconocido" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Error de red" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async (courseId?: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const url = courseId ? `/api/admin/export-progress?courseId=${courseId}` : '/api/admin/export-progress';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al generar el CSV');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = courseId ? `avance_${courseId}.csv` : 'usuarios_avance.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Hubo un error al descargar los avances.');
    }
  };

  const handleDeleteUser = async (targetUid: string) => {
    if (!user) return;
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR permanentemente a este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUid })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers(); // Recargar lista
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error de red al intentar eliminar el usuario.');
    }
  };


  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="bg-[#0B0C10] min-h-screen text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <header className="border-b border-neon-purple/30 pb-6">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan drop-shadow-[0_0_10px_rgba(138,43,226,0.5)]">
              PANEL DE CONTROL ADMINISTRATIVO
            </h1>
            <p className="mt-2 text-slate-400">Acceso restringido Nivel 1. Otorgamiento de membresías gratuitas.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Formulario */}
            <div className="md:col-span-1">
              <div className="bg-[#12131A] border border-neon-cyan/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-neon-cyan">⚡</span> Nueva Alta
                </h2>
                <form onSubmit={handleGrantAccess} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Correo Electrónico del Alumno</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                      placeholder="alumno@ejemplo.com"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neon-cyan text-black font-bold py-3 px-4 rounded-lg hover:bg-white hover:shadow-[0_0_15px_#00FFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "PROCESANDO..." : "OTORGAR ACCESO"}
                  </button>

                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-neon-green/10 border border-neon-green text-neon-green' : 'bg-red-500/10 border border-red-500 text-red-500'} break-words`}>
                      {message.text}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="md:col-span-2">
              <div className="bg-[#12131A] border border-neon-pink/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,0,127,0.1)]">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-neon-pink">👥</span> Alumnos con Acceso Gratuito
                  </h2>
                  <button
                    onClick={() => handleDownloadCSV()}
                    className="bg-neon-green/10 text-neon-green border border-neon-green font-bold py-2 px-4 rounded hover:bg-neon-green hover:text-black hover:shadow-[0_0_15px_#39FF14] transition-all flex items-center gap-2 text-sm"
                  >
                    <span>📊</span> Descargar CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Contraseña Temporal</th>
                        <th className="px-6 py-4 font-medium">Fecha de Alta</th>
                        <th className="px-6 py-4 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {fetching ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                            Cargando registros...
                          </td>
                        </tr>
                      ) : grantedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                            No hay alumnos registrados con acceso gratuito aún.
                          </td>
                        </tr>
                      ) : (
                        grantedUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{u.email}</td>
                            <td className="px-6 py-4">
                              <code className="bg-black px-2 py-1 rounded text-neon-pink border border-neon-pink/30 font-mono">
                                {u.temporaryPassword}
                              </code>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {new Date(u.grantedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"
                                title="Eliminar Usuario"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Sección de Descargas de Avances */}
          <div className="bg-[#12131A] border border-indigo-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)] mt-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-indigo-400">📥</span> Descargar Avances por Curso
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDownloadCSV()}
                className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded font-semibold transition-all text-sm shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              >
                🌍 Global (Todos)
              </button>
              {[
                { id: 'pm1', label: 'PM1' },
                { id: 'pm2', label: 'PM2' },
                { id: 'pm3', label: 'PM3' },
                { id: 'pm4', label: 'PM4' },
                { id: 'fisica', label: 'Física' },
                { id: 'autocad', label: 'AutoCAD' },
                { id: 'archicad', label: 'Archicad' },
                { id: 'matematicas-basicas', label: 'Matemáticas' },
                { id: 'excel-intermedio', label: 'Excel' }
              ].map(course => (
                <button
                  key={course.id}
                  onClick={() => handleDownloadCSV(course.id)}
                  className="bg-slate-800 text-slate-300 border border-slate-700 hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan px-4 py-2 rounded font-medium transition-all text-sm"
                >
                  {course.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
