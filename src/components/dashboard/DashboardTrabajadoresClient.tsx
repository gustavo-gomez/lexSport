'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Select, Input, Button } from '@/components/ui'
import { WorkerChart } from './WorkerChart'
import { getActivitiesByWorker } from '@/actions/activities'
import type { SelectOption } from '@/components/ui'

interface WorkerData {
  workerId: string
  name: string
  quantity: number
}

interface Worker {
  id: string
  firstName: string
  lastName: string
}

interface DashboardTrabajadoresClientProps {
  workers: Worker[]
}

function getPeruDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

function getDefaultDates() {
  const now = new Date()
  const peruNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }))
  const oneMonthAgo = new Date(peruNow.getFullYear(), peruNow.getMonth() - 1, peruNow.getDate())

  return {
    startDate: getPeruDateString(oneMonthAgo),
    endDate: getPeruDateString(now),
  }
}

export function DashboardTrabajadoresClient({ workers }: DashboardTrabajadoresClientProps) {
  const [data, setData] = useState<WorkerData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const defaults = getDefaultDates()
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [workerId, setWorkerId] = useState('')

  const workerOptions: SelectOption[] = workers.map((w) => ({
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

      const result = await getActivitiesByWorker(start, end, workerId || undefined)
      // Sort by quantity descending
      result.sort((a: WorkerData, b: WorkerData) => b.quantity - a.quantity)
      setData(result)
    } catch (error) {
      console.error('Error loading data:', error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard - Trabajadores</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Fecha inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <Select
            label="Trabajador"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...workerOptions]}
          />
          <div className="flex items-end">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Buscar
            </Button>
          </div>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Cantidad Elaborada por Trabajador</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
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
              Seleccione un rango de fechas para ver las estadísticas de producción.
            </p>
          ) : data.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No se encontraron datos para el rango seleccionado.
            </div>
          ) : (
            <WorkerChart
              data={data.map((d) => ({
                name: d.name,
                quantity: d.quantity,
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
