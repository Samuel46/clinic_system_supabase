import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

interface RolePermissions {
  [key: string]: string[];
}

const rolePermissions: RolePermissions = {
  admin: ["*"],
  clinic: ["/admin/invitations"],
  doctor: [],
};
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });

    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      return null;
    }

    // if the email is verified redirect the user to login page REVISIT!
    if (
      req.nextUrl.pathname.startsWith("/verify-email") &&
      req.nextauth.token?.emailVerified !== null
    ) {
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    const userRole: string | undefined = token?.role;
    const requestedPath = req.nextUrl.pathname;

    console.log(userRole);

    // if (userRole) {
    //   const allowedPaths = rolePermissions[userRole] || [];
    //   const hasPermission =
    //     allowedPaths.includes("*") ||
    //     allowedPaths.some((path) => requestedPath.startsWith(path));

    //   if (!hasPermission) {
    //     return NextResponse.redirect(new URL("/forbidden", req.url)); // Redirect to a "Forbidden" page or similar
    //   }
    // } else {
    //   return NextResponse.redirect(new URL("/forbidden", req.url)); // Redirect to a "Forbidden" page or similar
    // }
  },

  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/admin/:path*",
    // "/admin/tenants/:path*",
    // "/admin/invitations/:path*",
  ],
};
