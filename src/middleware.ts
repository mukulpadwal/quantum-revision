import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(async (request: NextRequest) => {
    const session = await auth();
    console.log(session);

    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/" || path === "/login" || path === "/signup";

    if (session && isPublicPath) {
        return NextResponse.redirect(new URL("/homepage", request.nextUrl));
    }

    if (!session && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/about",
        "/contact",
        "/faqs",
        "/privacypolicy",
        "/how-to-use",
        "/resetpassword",
        "/changepassword",
    ],
};
