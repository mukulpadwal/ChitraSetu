import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const protectedRoutes = ["/products", "/profile", "/orders", "/admin"];
  const publicRoutes = ["/", "/login", "/signup"];
  const adminRoutes = [
    "/admin/list-product",
    "/admin/listed-products",
    "/admin/dashboard",
  ];

  const isProductPage = pathname.startsWith("/products/");
  const isAdminPage = pathname.startsWith("/admin/");

  // Redirect authenticated users away from public routes
  if (session && publicRoutes.includes(pathname)) {
    const newUrl = new URL("/products", req.nextUrl.origin); // Redirect to /products if already logged in
    return NextResponse.redirect(newUrl);
  }

  // Redirect unauthenticated users away from protected routes, including product pages
  if (
    !session &&
    (protectedRoutes.includes(pathname) || isProductPage || isAdminPage)
  ) {
    const newUrl = new URL("/login", req.nextUrl.origin); // Redirect to /login if not logged in
    return NextResponse.redirect(newUrl);
  }

  if (session && pathname.includes("/admin")) {
    if (session.user.role !== "admin" && adminRoutes.includes(pathname)) {
      // We need to stop normal user from accesing the admin routes
      const newUrl = new URL("/admin", req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    }
  }

  // Allow the request to continue to the next middleware or page
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
