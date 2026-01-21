import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LexSport - Sistema de Gestión',
  description: 'Sistema de gestión para manufactura textil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
