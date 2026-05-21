/**
 * @file app/api/tools/route.ts
 * @description Tools API route — GET the list of supported AI tools with pricing.
 */

import { NextResponse } from "next/server";
// import pricingData from "@/data/pricing.json";

export const runtime = "edge";

export function GET() {
  // TODO: Return tools list from pricing.json with optional filtering
  // const { tools } = pricingData;
  // return NextResponse.json({ tools, count: tools.length });

  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
