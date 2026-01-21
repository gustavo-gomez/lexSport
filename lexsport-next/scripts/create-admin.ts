/**
 * Script para crear un usuario admin de prueba
 *
 * Uso: npx tsx scripts/create-admin.ts
 */

import 'dotenv/config'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'keylexsportsystem'

function hashPassword(password: string): string {
  return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}

async function main() {
  const { PrismaClient } = await import('@prisma/client')

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  })

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
