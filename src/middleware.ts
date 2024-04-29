import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("authjs.session-token")?.value || "";

  const path = request.nextUrl.pathname;

  console.log(path);


  // If the user is not logged in
  if (!session) {
    if (path === "/homepage" || path === "/myaccount/profile" || path === "/myaccount/delete" || path === "/myaccount/changepassword") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  // If the user is logged in
  if (session) {
    if (path === "/" || path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/homepage", request.nextUrl));
    }
  }

  return NextResponse.next();
}

// Always run middleware logic on these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/homepage", "/myaccount/:path*"],
};
