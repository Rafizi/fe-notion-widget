import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface MiddlewareRequest extends NextRequest {
  // Extends NextRequest for type safety
}

export async function middleware(req: MiddlewareRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();
  return res;
}
