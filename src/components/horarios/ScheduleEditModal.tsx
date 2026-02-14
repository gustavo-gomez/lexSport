'use client'

import { useState } from 'react'
import { Modal, Button, TimePicker } from '@/components/ui'
import { updateScheduleBatch } from '@/actions/schedules'
import type { GroupedSchedule } from '@/actions/schedules'

interface ScheduleEditModalProps {
  schedule: GroupedSchedule | null
  onClose: () => void
  onSuccess: () => void
}

export function ScheduleEditModal({ schedule, onClose, onSuccess }: ScheduleEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    enter: schedule?.enter || '',
    break: schedule?.break || '',
    endbreak: schedule?.endbreak || '',
    exit: schedule?.exit || '',
  })

  if (!schedule) return null

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const updates: { id: string; date: Date }[] = []

      // Parse the date from dateKey (YYYY-MM-DD)
      const [year, month, day] = schedule.dateKey.split('-').map(Number)

      const createDate = (time: string): Date => {
        const [hours, minutes] = time.split(':').map(Number)
        // Create date in Peru time (UTC-5)
        const date = new Date(Date.UTC(year, month - 1, day, hours + 5, minutes))
        return date
      }

      if (schedule.enterId && formData.enter) {
        updates.push({ id: schedule.enterId, date: createDate(formData.enter) })
      }
      if (schedule.breakId && formData.break) {
        updates.push({ id: schedule.breakId, date: createDate(formData.break) })
      }
      if (schedule.endbreakId && formData.endbreak) {
        updates.push({ id: schedule.endbreakId, date: createDate(formData.endbreak) })
      }
      if (schedule.exitId && formData.exit) {
        updates.push({ id: schedule.exitId, date: createDate(formData.exit) })
      }

      if (updates.length > 0) {
        await updateScheduleBatch(updates)
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={!!schedule} onClose={onClose} title="Editar Horario">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Trabajador:</span> {schedule.workerName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fecha:</span> {schedule.dateKey}
          </p>
        </div>

        <TimePicker
          label="Hora de Ingreso"
          value={formData.enter}
          onChange={handleChange('enter')}
          disabled={isLoading || !schedule.enterId}
        />

        <TimePicker
          label="Hora de Refrigerio"
          value={formData.break}
          onChange={handleChange('break')}
          disabled={isLoading || !schedule.breakId}
        />

        <TimePicker
          label="Fin de Refrigerio"
          value={formData.endbreak}
          onChange={handleChange('endbreak')}
          disabled={isLoading || !schedule.endbreakId}
        />

        <TimePicker
          label="Hora de Salida"
          value={formData.exit}
          onChange={handleChange('exit')}
          disabled={isLoading || !schedule.exitId}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Actualizar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
