// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  COSTURERA: 'costurera',
  OPERATOR: 'operator',
  JORNALERO: 'jornalero',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Permisos de operador
export const OPERATOR_PERMISSIONS = {
  MAKES: 'makes',
  FILL: 'fill',
  SCHEDULE: 'schedule',
} as const

export type OperatorPermission = (typeof OPERATOR_PERMISSIONS)[keyof typeof OPERATOR_PERMISSIONS]

// Acciones de actividad
export const ACTIVITY_ACTIONS = {
  MAKE: 'make',
  FILL: 'fill',
} as const

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS]

// Acciones de horario
export const SCHEDULE_ACTIONS = {
  ENTER: 'enter',
  BREAK: 'break',
  END_BREAK: 'endbreak',
  EXIT: 'exit',
} as const

export type ScheduleAction = (typeof SCHEDULE_ACTIONS)[keyof typeof SCHEDULE_ACTIONS]

// Textos en español para UI
export const SCHEDULE_ACTIONS_TEXT: Record<ScheduleAction, string> = {
  [SCHEDULE_ACTIONS.ENTER]: 'Ingreso',
  [SCHEDULE_ACTIONS.BREAK]: 'Refrigerio',
  [SCHEDULE_ACTIONS.END_BREAK]: 'Fin refrigerio',
  [SCHEDULE_ACTIONS.EXIT]: 'Salida',
}

export const OPERATOR_PERMISSIONS_TEXT: Record<OperatorPermission, string> = {
  [OPERATOR_PERMISSIONS.MAKES]: 'Confección',
  [OPERATOR_PERMISSIONS.FILL]: 'Llenados',
  [OPERATOR_PERMISSIONS.SCHEDULE]: 'Horarios',
}

// Peru timezone offset (UTC-5)
export const PERU_TIME_OFFSET = -5
export const MILLISECONDS_IN_ONE_HOUR = 3600 * 1000
export const MILLISECONDS_IN_ONE_DAY = MILLISECONDS_IN_ONE_HOUR * 24
