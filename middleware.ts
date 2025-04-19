import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes require authentication
const protectedRoutes = ["/dashboard", "/services", "/profile"]

// Define which routes are only for guests (non-authenticated users)
const guestRoutes = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  const path = request.nextUrl.pathname

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isGuestRoute = guestRoutes.some((route) => path.startsWith(route))

  // If the route requires authentication and the user is not authenticated
  if (isProtectedRoute && !sessionId) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // If the route is for guests only and the user is authenticated
  if (isGuestRoute && sessionId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
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
}
