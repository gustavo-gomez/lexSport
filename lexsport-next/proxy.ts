import { NextRequest, NextResponse } from 'next/server'

/**
 * proxy.ts - Next.js 16 (reemplaza middleware.ts)
 *
 * IMPORTANTE: Solo para routing ligero.
 * La autenticación real se hace en Server Layout Guards.
 * NO validar JWT ni hacer llamadas a BD aquí.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren verificación
  const publicPaths = ['/login', '/api/auth']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Todas las demás verificaciones de auth se hacen en los layouts
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
