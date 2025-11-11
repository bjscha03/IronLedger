import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporarily disabled for UI preview
// Will re-enable when database is set up

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
