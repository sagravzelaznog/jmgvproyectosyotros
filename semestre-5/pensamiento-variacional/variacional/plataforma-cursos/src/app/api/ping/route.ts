import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ version: "dynamic-import-deployed", status: "ok" });
}
