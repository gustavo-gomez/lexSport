'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROLES, OPERATOR_PERMISSIONS } from '@/types'

interface SidebarProps {
  user: {
    role?: string | null
    permission?: string | null
  }
}

interface MenuItem {
  label: string
  href: string
  icon: string
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = user.role === ROLES.ADMIN
  const permissions = user.permission?.split(',') || []

  // Menú para admin
  const adminMenuItems: MenuItem[] = [
    { label: 'Historial', href: '/historial', icon: '📋' },
    { label: 'Horarios', href: '/horarios', icon: '🕐' },
    { label: 'Trabajadores', href: '/trabajadores', icon: '👥' },
    { label: 'Productos', href: '/productos', icon: '📦' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Operadores', href: '/operadores', icon: '🔧' },
    { label: 'Dashboard Productos', href: '/dashboard/productos', icon: '📊' },
    { label: 'Dashboard Trabajadores', href: '/dashboard/trabajadores', icon: '📈' },
  ]

  // Menú filtrado para operadores según permisos
  const getOperatorMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = []

    if (
      permissions.includes(OPERATOR_PERMISSIONS.MAKES) ||
      permissions.includes(OPERATOR_PERMISSIONS.FILL)
    ) {
      items.push({ label: 'Historial', href: '/historial', icon: '📋' })
    }

    if (permissions.includes(OPERATOR_PERMISSIONS.SCHEDULE)) {
      items.push({ label: 'Horarios', href: '/horarios', icon: '🕐' })
    }

    return items
  }

  const menuItems = isAdmin ? adminMenuItems : getOperatorMenuItems()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <span className="text-2xl font-bold text-blue-600">LS</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500">
          {isAdmin ? 'Administrador' : 'Operador'}
        </p>
      </div>
    </aside>
  )
}
