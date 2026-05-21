/**
 * @file app/api/audit/route.ts
 * @description Audit API route — POST to create a new audit.
 * TODO: Implement with auth + audit-engine
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  // TODO: 1. Validate session (Supabase auth)
  // TODO: 2. Parse + validate request body (Zod)
  // TODO: 3. Run audit engine
  // TODO: 4. Store result in Supabase
  // TODO: 5. Return audit report

  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}

export async function GET(_request: NextRequest) {
  // TODO: Return paginated list of audits for current user's organization

  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
