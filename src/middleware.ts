import { NextRequest, NextResponse } from "next/server";
import conf from "./conf/conf";

export async function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value || null;
  const secureSessionToken =
    request.cookies.get("__Secure-authjs.session-token") || null;



  const path = request.nextUrl.pathname;

  // If the user is not logged in
  if (!sessionToken || !secureSessionToken) {
    if (
      path === "/homepage" ||
      path === "/myaccount/profile" ||
      path === "/myaccount/delete" ||
      path === "/myaccount/changepassword"
    ) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  // If the user is logged in
  if (sessionToken || secureSessionToken) {
    if (path === "/" || path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/homepage", request.nextUrl));
    }
  }
}

// Always run middleware logic on these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/homepage", "/myaccount/:path*"],
};
