import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/products", "/profile", "/orders", "/admin"];
const publicRoutes = ["/", "/login", "/signup"];
const adminRoutes = [
  "/admin/list-product",
  "/admin/listed-products",
  "/admin/dashboard",
];

const isRouteProtected = (pathname: string) => {
  const isProductPage = pathname.startsWith("/products/");
  const isAdminPage = pathname.startsWith("/admin/");
  const isProfilePage = pathname.startsWith("/profile/");
  return (
    protectedRoutes.includes(pathname) ||
    isProductPage ||
    isAdminPage ||
    isProfilePage
  );
};

const isAdminRoute = (pathname: string) => adminRoutes.includes(pathname);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Redirect authenticated users away from public routes
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/products", req.nextUrl.origin));
  }

  // Redirect unauthenticated users away from protected routes
  if (!session && isRouteProtected(pathname)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  // Restrict non-admin users from accessing admin routes
  if (session && pathname.includes("/admin")) {
    if (session.user.role !== "admin" && isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
  }

  // Allow the request to continue to the next middleware or page
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
