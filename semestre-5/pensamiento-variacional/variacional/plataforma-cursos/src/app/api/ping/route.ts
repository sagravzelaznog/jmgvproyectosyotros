import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ version: "force-dynamic-deployed", status: "ok" });
}
