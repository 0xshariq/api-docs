import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/quran","/login", "/register","/"];

  // If the user is NOT authenticated and NOT visiting a public route, redirect to login
  if (!authToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url)); // Redirect to login
  }

  // If the user is authenticated and tries to access login/register, redirect to homepage
  if (authToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
