/**
 * Prisma Client Singleton
 *
 * IMPORTANTE: Ejecutar `npx prisma generate` después de instalar dependencias
 * para generar el cliente de Prisma.
 *
 * Pasos de configuración:
 * 1. npm install
 * 2. npx prisma generate
 * 3. npx prisma db push (o prisma migrate dev para desarrollo)
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare const globalThis: {
  prisma: any | undefined
} & typeof global

let prisma: any

export function getPrismaClient(): any {
  if (prisma) return prisma

  // En desarrollo, usar instancia global para evitar múltiples conexiones
  if (process.env.NODE_ENV !== 'production') {
    if (!globalThis.prisma) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { PrismaClient } = require('@prisma/client')
        globalThis.prisma = new PrismaClient()
      } catch {
        console.warn('Prisma Client not generated. Run: npx prisma generate')
        return null
      }
    }
    prisma = globalThis.prisma
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require('@prisma/client')
      prisma = new PrismaClient()
    } catch {
      console.warn('Prisma Client not generated. Run: npx prisma generate')
      return null
    }
  }

  return prisma
}

// Exportar alias para uso directo
export const db = getPrismaClient
