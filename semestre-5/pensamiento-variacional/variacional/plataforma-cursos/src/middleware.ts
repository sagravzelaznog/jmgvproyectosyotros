import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Aquí podemos proteger rutas de API internas o del panel administrativo
  // En Next.js con Firebase, la protección estricta del front-end es más
  // eficiente hacerla del lado del cliente (ProtectedRoute), pero el middleware
  // actúa como una capa adicional para el servidor.
  
  if (path.startsWith('/api/admin')) {
    // Ejemplo: Verificar token en los headers para llamadas a API admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
