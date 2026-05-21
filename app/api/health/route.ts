/**
 * @file app/api/health/route.ts
 * @description Health check endpoint for Vercel + monitoring services.
 */

import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "stackaudit-api",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
    },
    { status: 200 }
  );
}
