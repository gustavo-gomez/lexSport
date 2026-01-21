/**
 * Prisma Client Singleton para Prisma 7
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
        const { PrismaClient } = require('@prisma/client')
        // Prisma 7: pasar datasourceUrl al constructor
        globalThis.prisma = new PrismaClient({
          datasourceUrl: process.env.DATABASE_URL,
        })
      } catch (error) {
        console.warn('Prisma Client not generated. Run: npx prisma generate', error)
        return null
      }
    }
    prisma = globalThis.prisma
  } else {
    try {
      const { PrismaClient } = require('@prisma/client')
      // Prisma 7: pasar datasourceUrl al constructor
      prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      })
    } catch (error) {
      console.warn('Prisma Client not generated. Run: npx prisma generate', error)
      return null
    }
  }

  return prisma
}

// Exportar alias para uso directo
export const db = getPrismaClient
