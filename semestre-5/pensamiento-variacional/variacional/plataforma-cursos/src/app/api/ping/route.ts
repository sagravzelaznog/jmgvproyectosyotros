import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ version: "400-fix-deployed", status: "ok" });
}
