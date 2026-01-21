/**
 * Script para generar el hash de password y SQL INSERT para admin
 *
 * Uso: npx tsx scripts/create-admin.ts
 */

import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import { randomUUID } from 'crypto'

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'keylexsportsystem'

function hashPassword(password: string): string {
  return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}

// Datos del admin
const adminUser = 'admin'
const adminPassword = 'admin123' // Cambia esto
const hashedPassword = hashPassword(adminPassword)
const id = randomUUID()

console.log('='.repeat(60))
console.log('DATOS DEL USUARIO ADMIN')
console.log('='.repeat(60))
console.log(`Usuario: ${adminUser}`)
console.log(`Contraseña: ${adminPassword}`)
console.log(`Hash: ${hashedPassword}`)
console.log('')
console.log('='.repeat(60))
console.log('SQL INSERT')
console.log('='.repeat(60))
console.log(`
INSERT INTO worker (id, first_name, last_name, user, password, role, hidden)
VALUES (
  '${id}',
  'Admin',
  'Sistema',
  '${adminUser}',
  '${hashedPassword}',
  'admin',
  0
);
`)
