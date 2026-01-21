'use client'

import { signOut } from 'next-auth/react'

interface HeaderProps {
  user: {
    name?: string | null
    role?: string | null
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">LexSport</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}
