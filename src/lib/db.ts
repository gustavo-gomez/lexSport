/**
 * Prisma Client Singleton para Prisma 7
 *
 * Prisma 7 requiere un driver adapter para conectarse a la base de datos.
 * Para MySQL/MariaDB usamos @prisma/adapter-mariadb
 */

import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/generated/prisma'

declare const globalThis: {
  prisma: PrismaClient | undefined
} & typeof global

function parseConnectionUrl(url: string) {
  // Parse: mysql://user:password@host:port/database
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
  const match = url.match(regex)

  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database')
  }

  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5].split('?')[0], // Remove query params if present
  }
}

function createPrismaClient(): PrismaClient {
  const connectionUrl = process.env.DATABASE_URL

  if (!connectionUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const { user, password, host, port, database } = parseConnectionUrl(connectionUrl)

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
  })

  return new PrismaClient({ adapter })
}

export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV !== 'production') {
    // En desarrollo, usar instancia global para evitar múltiples conexiones
    if (!globalThis.prisma) {
      globalThis.prisma = createPrismaClient()
    }
    return globalThis.prisma
  }

  // En producción, crear nueva instancia
  return createPrismaClient()
}

// Exportar alias para uso directo
export const db = getPrismaClient
