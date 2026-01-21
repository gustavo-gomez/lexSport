/**
 * Script para crear un usuario admin de prueba
 *
 * Uso: npx tsx scripts/create-admin.ts
 */

import 'dotenv/config'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { join } from 'path'

// Dynamic import using process.cwd() (run from project root)
const prismaPath = join(process.cwd(), 'src/generated/prisma')
const { PrismaClient } = require(prismaPath)

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'keylexsportsystem'

function hashPassword(password: string): string {
  return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}

function parseConnectionUrl(url: string) {
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
    database: match[5].split('?')[0],
  }
}

async function main() {
  const connectionUrl = process.env.DATABASE_URL

  if (!connectionUrl) {
    console.error('DATABASE_URL no está configurada en .env')
    process.exit(1)
  }

  const { user, password, host, port, database } = parseConnectionUrl(connectionUrl)

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
  })

  const prisma = new PrismaClient({ adapter })

  try {
    // Datos del admin de prueba
    const adminUser = 'admin'
    const adminPassword = 'admin123' // Cambia esto en producción
    const hashedPassword = hashPassword(adminPassword)

    // Verificar si ya existe
    const existing = await prisma.worker.findUnique({
      where: { user: adminUser },
    })

    if (existing) {
      console.log('El usuario admin ya existe.')
      console.log(`  Usuario: ${adminUser}`)
      console.log(`  ID: ${existing.id}`)
      return
    }

    // Crear el usuario admin
    const admin = await prisma.worker.create({
      data: {
        firstName: 'Admin',
        lastName: 'Sistema',
        user: adminUser,
        password: hashedPassword,
        role: 'admin',
        hidden: 0,
      },
    })

    console.log('Usuario admin creado exitosamente!')
    console.log(`  Usuario: ${adminUser}`)
    console.log(`  Contraseña: ${adminPassword}`)
    console.log(`  ID: ${admin.id}`)
    console.log('')
    console.log('IMPORTANTE: Cambia la contraseña en producción.')
  } catch (error) {
    console.error('Error al crear admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
