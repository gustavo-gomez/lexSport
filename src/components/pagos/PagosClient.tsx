'use client'

import { useState, useMemo } from 'react'
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
  Input,
  Select,
} from '@/components/ui'
import { getActivities } from '@/actions/activities'
import { ACTIVITY_ACTIONS } from '@/types'
import * as XLSX from 'xlsx'

interface Worker {
  id: string
  firstName: string
  lastName: string
}

interface Activity {
  id: string
  workerId: string
  productId: string
  quantity: number
  action: string
  price: number
  date: string
  worker: {
    id: string
    firstName: string
    lastName: string
  } | null
  product: {
    id: string
    code: string
    name: string
  } | null
}

interface PagosClientProps {
  workers: Worker[]
}

function getPeruDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

export function PagosClient({ workers }: PagosClientProps) {
  const today = getPeruDateString()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [workerId, setWorkerId] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedWorker, setSearchedWorker] = useState<Worker | null>(null)

  const workerOptions = [
    { value: '', label: 'Seleccionar costurera...' },
    ...workers.map(w => ({
      value: w.id,
      label: `${w.lastName}, ${w.firstName}`,
    })),
  ]

  const total = useMemo(() => {
    return activities.reduce((sum, a) => sum + a.price, 0)
  }, [activities])

  const handleSearch = async () => {
    if (!workerId) {
      alert('Debe seleccionar una costurera')
      return
    }

    setIsLoading(true)

    try {
      // Fechas en hora de Perú (UTC-5)
      const start = new Date(`${startDate}T00:00:00-05:00`)
      const end = new Date(`${endDate}T23:59:59.999-05:00`)

      const result = await getActivities({
        startDate: start,
        endDate: end,
        workerId,
      })

      setActivities(result)
      setSearchedWorker(workers.find(w => w.id === workerId) || null)
      setHasSearched(true)
    } catch (error) {
      console.error('Error al buscar:', error)
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Lima',
    })
  }

  const handleExport = () => {
    if (activities.length === 0) return

    const data = activities.map(a => ({
      'Fecha': formatDate(a.date),
      'Costurera': a.worker ? `${a.worker.lastName}, ${a.worker.firstName}` : '-',
      'Código Producto': a.product?.code || '-',
      'Producto': a.product?.name || '-',
      'Acción': a.action === ACTIVITY_ACTIONS.FILL ? 'Relleno' : 'Confección',
      'Cantidad': a.quantity,
      'Precio': a.price,
    }))

    // Agregar fila de total
    data.push({
      'Fecha': '',
      'Costurera': '',
      'Código Producto': '',
      'Producto': '',
      'Acción': '',
      'Cantidad': 'Total' as unknown as number,
      'Precio': total,
    })

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos')

    const workerName = searchedWorker
      ? `${searchedWorker.firstName}_${searchedWorker.lastName}`
      : 'pagos'
    const fileName = `${workerName}_${startDate}_${endDate}.xlsx`

    XLSX.writeFile(workbook, fileName)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
      </div>

      {/* Filtros */}
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
          <div className="w-full sm:w-56">
            <Select
              label="Costurera"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              options={workerOptions}
              required
            />
          </div>
          <Button onClick={handleSearch} isLoading={isLoading}>
            Buscar
          </Button>
          {activities.length > 0 && (
            <Button variant="outline" onClick={handleExport}>
              Exportar Excel
            </Button>
          )}
        </div>
      </div>

      {/* Tabla de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSearched ? (
            <p className="text-gray-500">
              Seleccione una costurera y rango de fechas para calcular pagos.
            </p>
          ) : isLoading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">
              No se encontraron registros para el rango seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Costurera</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell>
                        {activity.worker
                          ? `${activity.worker.lastName}, ${activity.worker.firstName}`
                          : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.product?.code || '-'}
                      </TableCell>
                      <TableCell>{activity.product?.name || '-'}</TableCell>
                      <TableCell>
                        {activity.action === ACTIVITY_ACTIONS.FILL ? (
                          <span className="text-green-600">Relleno</span>
                        ) : (
                          <span className="text-amber-600">Confección</span>
                        )}
                      </TableCell>
                      <TableCell>{activity.quantity}</TableCell>
                      <TableCell className="text-right">
                        S/ {activity.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fila de total */}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={5}></TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      S/ {total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
