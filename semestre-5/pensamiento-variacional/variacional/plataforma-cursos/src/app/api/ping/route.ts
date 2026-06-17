import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ version: "isolated-deployed", status: "ok" });
}
