'use server'

import { auth } from '@/lib/auth'
import { getPrismaClient } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROLES, OPERATOR_PERMISSIONS } from '@/types'

interface ActivityFilters {
  startDate: Date
  endDate: Date
  workerId?: string
  action?: string
}

/**
 * Obtener actividades con filtros
 */
export async function getActivities(filters: ActivityFilters) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const where: Record<string, unknown> = {
    date: {
      gte: filters.startDate,
      lte: filters.endDate,
    },
  }

  if (filters.workerId) {
    where.workerId = filters.workerId
  }

  if (filters.action) {
    where.action = filters.action
  }

  const activities = await prisma.activity.findMany({
    where,
    include: {
      worker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          oldWorker: true,
        },
      },
      product: {
        select: {
          id: true,
          code: true,
          name: true,
          makingPriceLow: true,
          makingPriceHigh: true,
          fillPrice: true,
        },
      },
      submitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })

  // Serializar Decimal y Date
  return activities.map(a => ({
    id: a.id,
    workerId: a.workerId,
    productId: a.productId,
    quantity: a.quantity,
    action: a.action,
    price: Number(a.price),
    date: a.date.toISOString(),
    worker: a.worker ? {
      id: a.worker.id,
      firstName: a.worker.firstName,
      lastName: a.worker.lastName,
      oldWorker: a.worker.oldWorker,
    } : null,
    product: a.product ? {
      id: a.product.id,
      code: a.product.code,
      name: a.product.name,
      makingPriceLow: Number(a.product.makingPriceLow),
      makingPriceHigh: Number(a.product.makingPriceHigh),
      fillPrice: Number(a.product.fillPrice),
    } : null,
  }))
}

interface CreateActivityData {
  workerId: string
  productId: string
  quantity: number
  action: string
  price: number
}

/**
 * Crear actividades (admin o operador con permisos)
 */
export async function createActivities(activities: CreateActivityData[], activityDate?: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  // Verificar permisos
  const isAdmin = session.user.role === ROLES.ADMIN
  const permissions = session.user.permission?.split(',') || []
  const canMake = permissions.includes(OPERATOR_PERMISSIONS.MAKES)
  const canFill = permissions.includes(OPERATOR_PERMISSIONS.FILL)

  if (!isAdmin && !canMake && !canFill) {
    throw new Error('No tiene permisos para crear actividades')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const submitterId = session.user.id
  // Si se pasa una fecha específica (YYYY-MM-DD), interpretarla como mediodía en Perú (UTC-5)
  // para evitar problemas de cambio de día por zona horaria
  const date = activityDate
    ? new Date(activityDate + 'T12:00:00-05:00')
    : new Date()

  // Crear todas las actividades
  for (const activity of activities) {
    // Verificar permiso específico para el tipo de actividad
    if (!isAdmin) {
      if (activity.action === 'make' && !canMake) {
        throw new Error('No tiene permiso para actividades de confección')
      }
      if (activity.action === 'fill' && !canFill) {
        throw new Error('No tiene permiso para actividades de llenado')
      }
    }

    await prisma.activity.create({
      data: {
        workerId: activity.workerId,
        productId: activity.productId,
        quantity: activity.quantity,
        action: activity.action,
        price: activity.price,
        submitterId,
        date,
      },
    })
  }

  revalidatePath('/historial')

  return { success: true }
}

/**
 * Actualizar una actividad (solo admin)
 */
export async function updateActivity(
  id: string,
  data: Partial<CreateActivityData>
) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  await prisma.activity.update({
    where: { id },
    data,
  })

  revalidatePath('/historial')

  return { success: true }
}

/**
 * Eliminar una actividad (solo admin)
 */
export async function deleteActivity(id: string) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  await prisma.activity.delete({
    where: { id },
  })

  revalidatePath('/historial')

  return { success: true }
}

/**
 * Obtener cantidades agrupadas por producto (para dashboard)
 */
export async function getActivitiesQuantities(
  startDate: Date,
  endDate: Date,
  workerId?: string
) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const where: Record<string, unknown> = {
    date: {
      gte: startDate,
      lt: endDate,
    },
  }

  if (workerId) {
    where.workerId = workerId
  }

  // Agrupar por producto y sumar cantidades
  const activities = await prisma.activity.groupBy({
    by: ['productId'],
    where,
    _sum: {
      quantity: true,
    },
  })

  // Get product details
  const productIds = activities.map((a: { productId: string }) => a.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, code: true, name: true },
  })

  const productMap = new Map(products.map((p: { id: string; code: string; name: string }) => [p.id, p]))

  return activities.map((a: { productId: string; _sum: { quantity: number | null } }) => {
    const product = productMap.get(a.productId)
    return {
      productId: a.productId,
      code: product?.code || '',
      name: product?.name || 'Producto desconocido',
      quantity: a._sum.quantity || 0,
    }
  })
}

/**
 * Obtener cantidades agrupadas por trabajador (para dashboard trabajadores)
 */
export async function getActivitiesByWorker(
  startDate: Date,
  endDate: Date,
  workerId?: string
) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const where: Record<string, unknown> = {
    date: {
      gte: startDate,
      lt: endDate,
    },
  }

  if (workerId) {
    where.workerId = workerId
  }

  // Agrupar por trabajador y sumar cantidades
  const activities = await prisma.activity.groupBy({
    by: ['workerId'],
    where,
    _sum: {
      quantity: true,
    },
  })

  // Get worker details
  const workerIds = activities.map((a: { workerId: string }) => a.workerId)
  const workers = await prisma.worker.findMany({
    where: { id: { in: workerIds } },
    select: { id: true, firstName: true, lastName: true },
  })

  const workerMap = new Map(workers.map((w: { id: string; firstName: string; lastName: string }) => [w.id, w]))

  return activities.map((a: { workerId: string; _sum: { quantity: number | null } }) => {
    const worker = workerMap.get(a.workerId)
    return {
      workerId: a.workerId,
      name: worker ? `${worker.lastName}, ${worker.firstName}` : 'Trabajador desconocido',
      quantity: a._sum.quantity || 0,
    }
  })
}
