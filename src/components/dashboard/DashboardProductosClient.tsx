'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { DateRangeFilter } from './DateRangeFilter'
import { ProductChart } from './ProductChart'
import { getActivitiesQuantities } from '@/actions/activities'

interface ProductData {
  productId: string
  code: string
  name: string
  quantity: number
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

export function DashboardProductosClient() {
  const [data, setData] = useState<ProductData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const defaults = getDefaultDates()
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)

  const handleSearch = async () => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      // Fechas en hora de Perú (UTC-5)
      const start = new Date(`${startDate}T00:00:00-05:00`)
      const end = new Date(`${endDate}T23:59:59.999-05:00`)

      const result = await getActivitiesQuantities(start, end)
      // Sort by quantity descending
      result.sort((a: ProductData, b: ProductData) => b.quantity - a.quantity)
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard - Productos</h1>
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cantidad Elaborada por Producto</CardTitle>
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
            <ProductChart
              data={data.map((d) => ({
                name: d.name,
                code: d.code,
                quantity: d.quantity,
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
