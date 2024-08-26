// import { validateRequest } from "@/auth/middlewares";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // console.log("middleware ran");
  // // 1. Check if route is protected
  // const protectedRoutes = ["/verify-email"];
  // const currentPath = req.nextUrl.pathname;
  // const isProtectedRoute = protectedRoutes.includes(currentPath);

  // if (isProtectedRoute) {
  //   // 2. Check for valid session
  //   const sessionId = cookies().get("session")?.value;
  //   if (!sessionId) {
  //     redirect("login");
  //   }
  //   const { user, session } = await lucia.validateSession(sessionId);
  //   console.log(user, session);
  //   // 3. Redirect unauthorized users
  //   if (!user || !session) {
  //     redirect("/login");
  //   }
  // }

  // 4. Handover the request to nextjs
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
