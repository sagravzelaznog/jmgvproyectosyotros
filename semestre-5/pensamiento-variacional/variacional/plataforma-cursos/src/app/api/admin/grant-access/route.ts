import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: true, 
      message: 'MOCK MEMBRESIA OTORGADA',
      email: 'mock@mock.com',
      password: 'mockpassword123'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, users: [{ id: 'mock', email: 'mock@mock.com' }] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
