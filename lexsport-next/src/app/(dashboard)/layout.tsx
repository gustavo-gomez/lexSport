import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

// Forzar renderizado dinámico para verificar sesión
export const dynamic = 'force-dynamic'

/**
 * Server Layout Guard para rutas protegidas
 *
 * Este es el patrón recomendado en Next.js 16 para autenticación.
 * La verificación se hace en el Server Component en lugar del proxy.ts
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirigir a login si no está autenticado
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={session.user} />
      <div className="flex flex-1 flex-col">
        <Header user={session.user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
