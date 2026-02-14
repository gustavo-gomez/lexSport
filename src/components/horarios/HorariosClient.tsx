'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@/components/ui'
import { HorariosFilters } from './HorariosFilters'
import { ScheduleEditModal } from './ScheduleEditModal'
import { getSchedulesGrouped, type GroupedSchedule } from '@/actions/schedules'

interface Worker {
  id: string
  firstName: string
  lastName: string
}

interface HorariosClientProps {
  workers: Worker[]
  isAdmin: boolean
}

function getPeruDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

function getDefaultDates() {
  const now = new Date()
  // Get current month/year in Peru timezone
  const peruNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }))
  const startOfMonth = new Date(peruNow.getFullYear(), peruNow.getMonth(), 1)

  return {
    startDate: getPeruDateString(startOfMonth),
    endDate: getPeruDateString(now),
  }
}

export function HorariosClient({ workers, isAdmin }: HorariosClientProps) {
  const [schedules, setSchedules] = useState<GroupedSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [scheduleToEdit, setScheduleToEdit] = useState<GroupedSchedule | null>(null)

  const defaults = getDefaultDates()
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [workerId, setWorkerId] = useState('')

  const workerOptions = workers.map((w) => ({
    value: w.id,
    label: `${w.lastName}, ${w.firstName}`,
  }))

  const handleSearch = async () => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      // Fechas en hora de Perú (UTC-5)
      const start = new Date(`${startDate}T00:00:00-05:00`)
      const end = new Date(`${endDate}T23:59:59.999-05:00`)

      const result = await getSchedulesGrouped({
        startDate: start,
        endDate: end,
        workerId: workerId || undefined,
      })
      setSchedules(result)
    } catch (error) {
      console.error('Error loading schedules:', error)
      setSchedules([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = () => {
    setScheduleToEdit(null)
    handleSearch()
  }

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatHours = (hours: string) => {
    return hours === '00:00' ? '-' : hours
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Horarios</h1>
        <Link href="/horarios/nuevo">
          <Button>+ Nuevo Registro</Button>
        </Link>
      </div>

      <HorariosFilters
        startDate={startDate}
        endDate={endDate}
        workerId={workerId}
        workers={workerOptions}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onWorkerChange={setWorkerId}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Registros de Horario</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg
                className="h-8 w-8 animate-spin text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : !hasSearched ? (
            <p className="text-gray-500">
              Seleccione un rango de fechas para ver los registros de horario.
            </p>
          ) : schedules.length === 0 ? (
            <p className="text-gray-500">
              No se encontraron registros de horario para el rango seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Refrigerio</TableHead>
                    <TableHead>Fin Refrigerio</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Horas Trabajadas</TableHead>
                    <TableHead>Horas Extras</TableHead>
                    <TableHead>Tardanza</TableHead>
                    {isAdmin && <TableHead className="w-16">Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule, index) => (
                    <TableRow key={`${schedule.dateKey}-${schedule.workerId}-${index}`}>
                      <TableCell className="whitespace-nowrap">{schedule.dateKey}</TableCell>
                      <TableCell className="font-medium">{schedule.workerName}</TableCell>
                      <TableCell>{schedule.enter || '-'}</TableCell>
                      <TableCell>{schedule.break || '-'}</TableCell>
                      <TableCell>{schedule.endbreak || '-'}</TableCell>
                      <TableCell>{schedule.exit || '-'}</TableCell>
                      <TableCell>{formatHours(schedule.workedHours)}</TableCell>
                      <TableCell>
                        <span className={schedule.extraHours !== '00:00' ? 'text-green-600 font-medium' : ''}>
                          {formatHours(schedule.extraHours)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={schedule.lateHours !== '00:00' ? 'text-red-600 font-medium' : ''}>
                          {formatHours(schedule.lateHours)}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <button
                            onClick={() => setScheduleToEdit(schedule)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleEditModal
        schedule={scheduleToEdit}
        onClose={() => setScheduleToEdit(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
