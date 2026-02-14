'use server'

import { auth } from '@/lib/auth'
import { getPrismaClient } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROLES } from '@/types'

/**
 * Obtener todos los productos
 */
export async function getProducts(search?: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const where: Record<string, unknown> = { hidden: 0 }

  if (search) {
    where.OR = [
      { code: { contains: search } },
      { name: { contains: search } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { code: 'asc' },
  })

  // Convertir Decimal a number para serialización
  return products.map(p => ({
    ...p,
    makingPriceLow: Number(p.makingPriceLow),
    makingPriceHigh: Number(p.makingPriceHigh),
    fillPrice: Number(p.fillPrice),
  }))
}

/**
 * Obtener un producto por ID
 */
export async function getProductById(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) return null

  // Convertir Decimal a number para serialización
  return {
    ...product,
    makingPriceLow: Number(product.makingPriceLow),
    makingPriceHigh: Number(product.makingPriceHigh),
    fillPrice: Number(product.fillPrice),
  }
}

/**
 * Crear un nuevo producto (solo admin)
 */
export async function createProduct(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const makingPriceLow = parseFloat(formData.get('makingPriceLow') as string)
  const makingPriceHigh = parseFloat(formData.get('makingPriceHigh') as string)
  const fillPrice = parseFloat(formData.get('fillPrice') as string) || 0

  await prisma.product.create({
    data: {
      code,
      name,
      description: description || null,
      makingPriceLow,
      makingPriceHigh,
      fillPrice,
    },
  })

  revalidatePath('/productos')

  return { success: true }
}

/**
 * Actualizar un producto (solo admin)
 */
export async function updateProduct(id: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const makingPriceLow = parseFloat(formData.get('makingPriceLow') as string)
  const makingPriceHigh = parseFloat(formData.get('makingPriceHigh') as string)
  const fillPrice = parseFloat(formData.get('fillPrice') as string) || 0

  await prisma.product.update({
    where: { id },
    data: {
      code,
      name,
      description: description || null,
      makingPriceLow,
      makingPriceHigh,
      fillPrice,
    },
  })

  revalidatePath('/productos')

  return { success: true }
}

/**
 * Eliminar (ocultar) un producto (solo admin)
 */
export async function deleteProduct(id: string) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  // Soft delete
  await prisma.product.update({
    where: { id },
    data: { hidden: 1 },
  })

  revalidatePath('/productos')

  return { success: true }
}
