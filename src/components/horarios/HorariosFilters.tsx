'use client'

import { Input, Select, Button } from '@/components/ui'
import { type SelectOption } from '@/components/ui'

interface HorariosFiltersProps {
  startDate: string
  endDate: string
  workerId: string
  workers: SelectOption[]
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onWorkerChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

export function HorariosFilters({
  startDate,
  endDate,
  workerId,
  workers,
  onStartDateChange,
  onEndDateChange,
  onWorkerChange,
  onSearch,
  isLoading,
}: HorariosFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Input
          label="Fecha inicio"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
        />
        <Input
          label="Fecha fin"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          required
        />
        <Select
          label="Trabajador"
          value={workerId}
          onChange={(e) => onWorkerChange(e.target.value)}
          options={[{ value: '', label: 'Todos' }, ...workers]}
        />
        <div className="flex items-end">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Buscar
          </Button>
        </div>
      </div>
    </form>
  )
}
