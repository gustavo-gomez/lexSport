import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'

// Forzar renderizado dinámico para verificar sesión
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  // Si ya está autenticado, redirigir según rol
  const session = await auth()

  if (session?.user) {
    if (session.user.role === 'admin') {
      redirect('/historial')
    } else {
      // Operador - redirigir según permisos
      const permissions = session.user.permission?.split(',') || []
      if (permissions.includes('makes') || permissions.includes('fill')) {
        redirect('/historial')
      } else if (permissions.includes('schedule')) {
        redirect('/horarios')
      }
      redirect('/historial')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
          LexSport
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sistema de Gestión
        </p>
        <LoginForm />
      </div>
    </div>
  )
}
