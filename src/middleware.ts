import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(async (request: NextRequest) => {
  const session = await auth();

  const path = request.nextUrl.pathname;

  // If the user is not logged in
  if (!session) {
    if (path === "/homepage" || path === "/profile") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  // If the user is logged in
  if (session) {
    if (path === "/" || path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/homepage", request.nextUrl));
    }
  }
});

// Always run middleware logic on these routes
export const config = {
  matcher: ["/", "/login", "/signup", "/homepage", "/profile"],
};
