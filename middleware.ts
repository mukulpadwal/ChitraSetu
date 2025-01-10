import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const protectedRoutes = ["/products", "/profile", "/orders"];
  const publicRoutes = ["/", "/login", "/signup"];

  const isProductPage = pathname.startsWith("/products/");

  // Redirect authenticated users away from public routes
  if (session && publicRoutes.includes(pathname)) {
    const newUrl = new URL("/products", req.nextUrl.origin); // Redirect to /products if already logged in
    return Response.redirect(newUrl);
  }

  // Redirect unauthenticated users away from protected routes, including product pages
  if (!session && (protectedRoutes.includes(pathname) || isProductPage)) {
    const newUrl = new URL("/login", req.nextUrl.origin); // Redirect to /login if not logged in
    return Response.redirect(newUrl);
  }

  // Allow the request to continue to the next middleware or page
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
