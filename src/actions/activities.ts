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
      lt: filters.endDate,
    },
  }

  if (filters.workerId) {
    where.workerId = filters.workerId
  }

  if (filters.action) {
    where.action = filters.action
  }

  return prisma.activity.findMany({
    where,
    include: {
      worker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          code: true,
          name: true,
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
export async function createActivities(activities: CreateActivityData[]) {
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
  const now = new Date()

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
        date: now,
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

  return activities.map((a: { productId: string; _sum: { quantity: number | null } }) => ({
    productId: a.productId,
    quantity: a._sum.quantity || 0,
  }))
}
