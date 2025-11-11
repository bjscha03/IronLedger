import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true
        }
        // Require token for dashboard and other protected routes
        return !!token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
  ],
}
