'use server'

import { auth } from '@/lib/auth'
import { getPrismaClient } from '@/lib/db'
import { hashPassword } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { ROLES } from '@/types'

/**
 * Obtener todos los trabajadores (opcionalmente filtrados por roles)
 */
export async function getWorkers(roles?: string[]) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const where: Record<string, unknown> = { hidden: 0 }

  if (roles && roles.length > 0) {
    where.role = { in: roles }
  }

  return prisma.worker.findMany({
    where,
    orderBy: { firstName: 'asc' },
  })
}

/**
 * Obtener un trabajador por ID
 */
export async function getWorkerById(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  return prisma.worker.findUnique({
    where: { id },
  })
}

/**
 * Crear un nuevo trabajador (solo admin)
 */
export async function createWorker(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string | null
  const role = formData.get('role') as string
  const permission = formData.get('permission') as string | null
  const user = formData.get('user') as string | null
  const password = formData.get('password') as string | null
  const oldWorker = formData.get('oldWorker') === 'true' ? 1 : 0

  const data = {
    firstName,
    lastName,
    phone: phone || null,
    role,
    permission: permission || null,
    user: user || null,
    password: password ? hashPassword(password) : null,
    oldWorker,
    canLogin: user ? 1 : 0,
  }

  await prisma.worker.create({ data })
  revalidatePath('/trabajadores')
  revalidatePath('/operadores')

  return { success: true }
}

/**
 * Actualizar un trabajador (solo admin)
 */
export async function updateWorker(id: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string | null
  const role = formData.get('role') as string
  const permission = formData.get('permission') as string | null
  const user = formData.get('user') as string | null
  const password = formData.get('password') as string | null
  const oldWorker = formData.get('oldWorker') === 'true' ? 1 : 0

  const data: Record<string, unknown> = {
    firstName,
    lastName,
    phone: phone || null,
    role,
    permission: permission || null,
    user: user || null,
    oldWorker,
  }

  // Solo actualizar password si se proporciona uno nuevo
  if (password) {
    data.password = hashPassword(password)
  }

  await prisma.worker.update({
    where: { id },
    data,
  })

  revalidatePath('/trabajadores')
  revalidatePath('/operadores')

  return { success: true }
}

/**
 * Eliminar (ocultar) un trabajador (solo admin)
 */
export async function deleteWorker(id: string) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  // Soft delete
  await prisma.worker.update({
    where: { id },
    data: { hidden: 1 },
  })

  revalidatePath('/trabajadores')
  revalidatePath('/operadores')

  return { success: true }
}
