'use client'

import { Input, Button } from '@/components/ui'

interface DateRangeFilterProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  isLoading,
}: DateRangeFilterProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
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
        <div className="flex items-end">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Buscar
          </Button>
        </div>
      </div>
    </form>
  )
}
