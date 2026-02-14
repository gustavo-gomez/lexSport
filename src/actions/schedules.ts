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

// Constants for schedule calculations
const PERU_TIME_OFFSET = -5
const SATURDAY = 6
const WEEKDAY_ENTER_HOUR = 7 // 7:00 AM
const SATURDAY_ENTER_HOUR = 8 // 8:00 AM
const WEEKDAY_WORKING_MINUTES = 600 // 10 hours (7am-6pm minus 1hr break)
const SATURDAY_WORKING_MINUTES = 300 // 5 hours (8am-1pm no break)

function getPeruDate(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000
  return new Date(utc + PERU_TIME_OFFSET * 3600000)
}

function getPeruDateKey(date: Date): string {
  const peru = getPeruDate(date)
  return `${peru.getFullYear()}-${String(peru.getMonth() + 1).padStart(2, '0')}-${String(peru.getDate()).padStart(2, '0')}`
}

function minutesToHoursMinutes(min: number): string {
  if (min < 0) return '00:00'
  const hours = Math.floor(min / 60)
  const minutes = Math.round(min % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function millisecondsToMinutes(ms: number): number {
  return Math.floor(ms / 60000)
}

function calcExtraMinutes(minutes: number, isSaturday: boolean): number {
  const totalMinutes = isSaturday ? SATURDAY_WORKING_MINUTES : WEEKDAY_WORKING_MINUTES
  const extra = minutes - totalMinutes
  return extra > 0 ? extra : 0
}

export interface GroupedSchedule {
  dateKey: string
  workerId: string
  workerName: string
  enter: string | null
  enterId: string | null
  break: string | null
  breakId: string | null
  endbreak: string | null
  endbreakId: string | null
  exit: string | null
  exitId: string | null
  workedHours: string
  extraHours: string
  lateHours: string
}

/**
 * Obtener horarios agrupados por trabajador y día (para tabla de historial)
 */
export async function getSchedulesGrouped(filters: ScheduleFilters): Promise<GroupedSchedule[]> {
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

  const schedules = await prisma.schedule.findMany({
    where,
    include: {
      worker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })

  // Group by date (Peru time) and worker
  const grouped: Record<string, Record<string, typeof schedules>> = {}

  for (const schedule of schedules) {
    const dateKey = getPeruDateKey(schedule.date)
    const workerId = schedule.workerId

    if (!grouped[dateKey]) {
      grouped[dateKey] = {}
    }
    if (!grouped[dateKey][workerId]) {
      grouped[dateKey][workerId] = []
    }
    grouped[dateKey][workerId].push(schedule)
  }

  // Process each group
  const result: GroupedSchedule[] = []

  for (const dateKey of Object.keys(grouped).sort().reverse()) {
    for (const workerId of Object.keys(grouped[dateKey])) {
      const workerSchedules = grouped[dateKey][workerId]

      const enterSchedule = workerSchedules.find(s => s.action === SCHEDULE_ACTIONS.ENTER)
      const breakSchedule = workerSchedules.find(s => s.action === SCHEDULE_ACTIONS.BREAK)
      const endbreakSchedule = workerSchedules.find(s => s.action === SCHEDULE_ACTIONS.END_BREAK)
      const exitSchedule = workerSchedules.find(s => s.action === SCHEDULE_ACTIONS.EXIT)

      const worker = workerSchedules[0]?.worker
      const workerName = worker ? `${worker.lastName}, ${worker.firstName}` : 'Desconocido'

      // Calculate hours
      let workedMinutes = 0
      let lateMinutes = 0

      const enterTime = enterSchedule?.date
      const breakTime = breakSchedule?.date
      const endbreakTime = endbreakSchedule?.date
      const exitTime = exitSchedule?.date

      const isSaturday = enterTime ? getPeruDate(enterTime).getDay() === SATURDAY : false

      if (enterTime && exitTime) {
        if (isSaturday) {
          // Saturday: no break, just entry to exit
          workedMinutes = millisecondsToMinutes(exitTime.getTime() - enterTime.getTime())
        } else if (breakTime && endbreakTime) {
          // Weekday: first period + second period
          const firstPeriod = breakTime.getTime() - enterTime.getTime()
          const secondPeriod = exitTime.getTime() - endbreakTime.getTime()
          workedMinutes = millisecondsToMinutes(firstPeriod + secondPeriod)
        }

        // Calculate late minutes
        const enterHour = isSaturday ? SATURDAY_ENTER_HOUR : WEEKDAY_ENTER_HOUR
        const peruEnter = getPeruDate(enterTime)
        const expectedEnter = new Date(peruEnter)
        expectedEnter.setHours(enterHour, 0, 0, 0)

        if (peruEnter.getTime() > expectedEnter.getTime()) {
          lateMinutes = millisecondsToMinutes(peruEnter.getTime() - expectedEnter.getTime())
        }
      }

      const extraMinutes = calcExtraMinutes(workedMinutes, isSaturday)

      const formatTime = (date: Date | undefined): string | null => {
        if (!date) return null
        const peru = getPeruDate(date)
        return `${String(peru.getHours()).padStart(2, '0')}:${String(peru.getMinutes()).padStart(2, '0')}`
      }

      result.push({
        dateKey,
        workerId,
        workerName,
        enter: formatTime(enterSchedule?.date),
        enterId: enterSchedule?.id || null,
        break: formatTime(breakSchedule?.date),
        breakId: breakSchedule?.id || null,
        endbreak: formatTime(endbreakSchedule?.date),
        endbreakId: endbreakSchedule?.id || null,
        exit: formatTime(exitSchedule?.date),
        exitId: exitSchedule?.id || null,
        workedHours: minutesToHoursMinutes(workedMinutes),
        extraHours: minutesToHoursMinutes(extraMinutes),
        lateHours: minutesToHoursMinutes(lateMinutes),
      })
    }
  }

  return result
}

/**
 * Actualizar horarios por lote (solo admin)
 */
export async function updateScheduleBatch(
  updates: { id: string; date: Date }[]
) {
  const session = await auth()
  if (session?.user?.role !== ROLES.ADMIN) {
    throw new Error('No autorizado - Se requiere rol admin')
  }

  const prisma = getPrismaClient()
  if (!prisma) {
    throw new Error('Base de datos no disponible')
  }

  for (const update of updates) {
    await prisma.schedule.update({
      where: { id: update.id },
      data: { date: update.date },
    })
  }

  revalidatePath('/horarios')

  return { success: true }
}
