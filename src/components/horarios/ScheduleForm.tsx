'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Select, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { createSchedules } from '@/actions/schedules'
import { SCHEDULE_ACTIONS, SCHEDULE_ACTIONS_TEXT } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
}

interface ScheduleFormProps {
  workers: Worker[]
}

interface ScheduleRow {
  workerId: string
  action: string
}

interface RowErrors {
  workerId?: string
  action?: string
}

const actionOptions = Object.entries(SCHEDULE_ACTIONS_TEXT).map(([value, label]) => ({
  value,
  label,
}))

const emptyRow: ScheduleRow = {
  workerId: '',
  action: SCHEDULE_ACTIONS.ENTER,
}

export function ScheduleForm({ workers }: ScheduleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState<ScheduleRow[]>([{ ...emptyRow }])
  const [errors, setErrors] = useState<RowErrors[]>([{}])
  const [generalError, setGeneralError] = useState<string | null>(null)

  const workerOptions = workers.map((w) => ({
    value: w.id,
    label: `${w.lastName}, ${w.firstName}`,
  }))

  const handleChange = (index: number, field: keyof ScheduleRow, value: string) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], [field]: value }
    setRows(newRows)

    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: undefined }
    setErrors(newErrors)
  }

  const addRow = () => {
    setRows([...rows, { ...emptyRow }])
    setErrors([...errors, {}])
  }

  const removeRow = (index: number) => {
    if (rows.length === 1) return
    const newRows = [...rows]
    newRows.splice(index, 1)
    setRows(newRows)

    const newErrors = [...errors]
    newErrors.splice(index, 1)
    setErrors(newErrors)
  }

  const validateForm = (): boolean => {
    const newErrors: RowErrors[] = rows.map((row) => {
      const rowErrors: RowErrors = {}
      if (!row.workerId) {
        rowErrors.workerId = 'Seleccione un trabajador'
      }
      if (!row.action) {
        rowErrors.action = 'Seleccione una acción'
      }
      return rowErrors
    })

    setErrors(newErrors)
    return newErrors.every((e) => Object.keys(e).length === 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setGeneralError(null)

    try {
      await createSchedules(rows)
      router.push('/horarios')
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Horarios</CardTitle>
        </CardHeader>
        <CardContent>
          {generalError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {generalError}
            </div>
          )}

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="relative flex flex-col gap-4 rounded-lg border bg-gray-50 p-4 md:flex-row md:items-end"
              >
                <div className="flex-1">
                  <Select
                    label="Trabajador"
                    value={row.workerId}
                    onChange={(e) => handleChange(index, 'workerId', e.target.value)}
                    options={workerOptions}
                    placeholder="Seleccionar trabajador..."
                    error={errors[index]?.workerId}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Acción"
                    value={row.action}
                    onChange={(e) => handleChange(index, 'action', e.target.value)}
                    options={actionOptions}
                    error={errors[index]?.action}
                    required
                    disabled={isLoading}
                  />
                </div>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="absolute right-2 top-2 rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700 md:relative md:right-0 md:top-0 md:mb-2"
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={addRow}
              disabled={isLoading}
            >
              + Agregar fila
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/horarios')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
