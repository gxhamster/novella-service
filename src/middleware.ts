import { User, createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  let user: User | null = null;

  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw new Error("Auth Error: Could not access user session");
    }
    user = data.user;
  } catch (error) {
    const errorFormatted = new Error(
      "Auth Error: Error occcured when trying to access session",
      {
        cause: error,
      }
    );
    console.error(errorFormatted);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // if user is signed in and the current path is / redirect the user to /dashboard
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/books/:path*",
    "/students/:path*",
    "/issued/:path*",
  ],
};
