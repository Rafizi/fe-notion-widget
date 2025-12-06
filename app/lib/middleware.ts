import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session biar cookie selalu valid
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
