'use client'

import { useState } from 'react'
import { Button, Input, Select } from '@/components/ui'

interface Worker {
  id: string
  firstName: string
  lastName: string
}

interface HistorialFiltersProps {
  workers: Worker[]
  onSearch: (filters: { startDate: string; endDate: string; workerId?: string }) => void
  isLoading?: boolean
}

function getPeruDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

export function HistorialFilters({ workers, onSearch, isLoading }: HistorialFiltersProps) {
  const today = getPeruDateString()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [workerId, setWorkerId] = useState('')

  const workerOptions = [
    { value: '', label: 'Todos' },
    ...workers.map(w => ({
      value: w.id,
      label: `${w.lastName}, ${w.firstName}`,
    })),
  ]

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      workerId: workerId || undefined,
    })
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full sm:w-auto">
          <Input
            type="date"
            label="Fecha inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Input
            type="date"
            label="Fecha fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Costurera"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            options={workerOptions}
          />
        </div>
        <Button onClick={handleSearch} isLoading={isLoading}>
          Buscar
        </Button>
      </div>
    </div>
  )
}
