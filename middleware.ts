import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoginPage = pathname === "/";
    const isProtectedRoute = pathname.startsWith("/portal");

    // Logged-in user visiting login page → redirect
    if (token?.email && isLoginPage) {
        return NextResponse.redirect(
            new URL("/portal", req.url)
        );
    }

    // Not logged-in user visiting protected page → redirect
    if (!token?.email && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/portal/:path*",
    ],
};
