'use server'

import { auth } from '@/lib/auth'
import { getPrismaClient } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROLES, OPERATOR_PERMISSIONS, SCHEDULE_ACTIONS } from '@/types'

interface ScheduleFilters {
  startDate: Date
  endDate: Date
  workerId?: string
}

/**
 * Obtener horarios con filtros
 */
export async function getSchedules(filters: ScheduleFilters) {
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

  return prisma.schedule.findMany({
    where,
    include: {
      worker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
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

interface CreateScheduleData {
  workerId: string
  action: string
}

/**
 * Crear registros de horario (admin o operador con permisos)
 */
export async function createSchedules(schedules: CreateScheduleData[]) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  // Verificar permisos
  const isAdmin = session.user.role === ROLES.ADMIN
  const permissions = session.user.permission?.split(',') || []
  const canSchedule = permissions.includes(OPERATOR_PERMISSIONS.SCHEDULE)

  if (!isAdmin && !canSchedule) {
    throw new Error('No tiene permisos para registrar horarios')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  const submitterId = session.user.id
  const now = new Date()

  // Validar acciones permitidas
  const validActions = Object.values(SCHEDULE_ACTIONS)

  // Crear todos los registros de horario
  for (const schedule of schedules) {
    if (!validActions.includes(schedule.action as typeof validActions[number])) {
      throw new Error(`Acción de horario inválida: ${schedule.action}`)
    }

    await prisma.schedule.create({
      data: {
        workerId: schedule.workerId,
        action: schedule.action,
        submitterId,
        date: now,
      },
    })
  }

  revalidatePath('/horarios')

  return { success: true }
}

/**
 * Actualizar un registro de horario (solo admin)
 */
export async function updateSchedule(
  id: string,
  data: { action?: string; date?: Date }
) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  // Validar acción si se proporciona
  if (data.action) {
    const validActions = Object.values(SCHEDULE_ACTIONS)
    if (!validActions.includes(data.action as typeof validActions[number])) {
      throw new Error(`Acción de horario inválida: ${data.action}`)
    }
  }

  await prisma.schedule.update({
    where: { id },
    data,
  })

  revalidatePath('/horarios')

  return { success: true }
}

/**
 * Eliminar un registro de horario (solo admin)
 */
export async function deleteSchedule(id: string) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  await prisma.schedule.delete({
    where: { id },
  })

  revalidatePath('/horarios')

  return { success: true }
}

/**
 * Obtener el último registro de horario de un trabajador
 */
export async function getLastScheduleAction(workerId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  return prisma.schedule.findFirst({
    where: { workerId },
    orderBy: { date: 'desc' },
    select: {
      id: true,
      action: true,
      date: true,
    },
  })
}
