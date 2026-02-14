'use client'

import { useState } from 'react'
import { Button, Input, Select, type SelectOption } from '@/components/ui'

function getPeruDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

interface DateRangeFilterProps {
  onSearch: (filters: {
    startDate: Date
    endDate: Date
    workerId?: string
  }) => void
  onExport?: () => void
  isLoading?: boolean
  showWorkerFilter?: boolean
  workers?: SelectOption[]
  isWorkerRequired?: boolean
  defaultStartDate?: Date
}

export function DateRangeFilter({
  onSearch,
  onExport,
  isLoading = false,
  showWorkerFilter = false,
  workers = [],
  isWorkerRequired = false,
  defaultStartDate,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>(
    defaultStartDate
      ? getPeruDateString(defaultStartDate)
      : getPeruDateString()
  )
  const [endDate, setEndDate] = useState<string>(getPeruDateString())
  const [workerId, setWorkerId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleSearch = () => {
    setError(null)

    if (showWorkerFilter && isWorkerRequired && !workerId) {
      setError('Seleccione un trabajador')
      return
    }

    // Fechas en hora de Perú (UTC-5)
    onSearch({
      startDate: new Date(`${startDate}T00:00:00-05:00`),
      endDate: new Date(`${endDate}T23:59:59.999-05:00`),
      workerId: workerId || undefined,
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-4">
        {showWorkerFilter && (
          <div className="min-w-[200px]">
            <Select
              label="Trabajador"
              options={workers}
              value={workerId}
              onChange={(e) => {
                setWorkerId(e.target.value)
                setError(null)
              }}
              placeholder="Seleccionar..."
              required={isWorkerRequired}
              error={error || undefined}
            />
          </div>
        )}

        <div className="min-w-[150px]">
          <Input
            type="date"
            label="Fecha Inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="min-w-[150px]">
          <Input
            type="date"
            label="Fecha Final"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {onExport && (
            <Button
              variant="primary"
              onClick={onExport}
              disabled={isLoading}
            >
              Exportar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSearch}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}
