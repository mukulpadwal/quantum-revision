import { NextRequest, NextResponse } from "next/server";
import conf from "./conf/conf";


export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(conf.sessionTokenName || conf.secureSessionTokenName)?.value || null;

  console.log(`COOKIES : ${request.cookies.getAll()}`);

  console.log(`Session Token : ${sessionToken}`);

  const path = request.nextUrl.pathname;

  // If the user is not logged in
  if (!sessionToken) {
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
  if (sessionToken) {
    if (path === "/" || path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/homepage", request.nextUrl));
    }
  }
}

// Always run middleware logic on these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/homepage", "/myaccount/:path*"],
};
