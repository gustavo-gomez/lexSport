'use client'

import { useState } from 'react'
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
  Modal,
} from '@/components/ui'
import { HistorialFilters } from './HistorialFilters'
import { ActivityForm } from './ActivityForm'
import { ActivityEditForm } from './ActivityEditForm'
import { getActivities, deleteActivity } from '@/actions/activities'
import { ACTIVITY_ACTIONS } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
  oldWorker: number
}

interface Product {
  id: string
  code: string
  name: string
  makingPriceLow: number
  makingPriceHigh: number
  fillPrice: number
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
    oldWorker: number
  } | null
  product: {
    id: string
    code: string
    name: string
    makingPriceLow: number
    makingPriceHigh: number
    fillPrice: number
  } | null
}

interface HistorialClientProps {
  workers: Worker[]
  products: Product[]
  isAdmin: boolean
}

export function HistorialClient({ workers, products, isAdmin }: HistorialClientProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null)
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [lastFilters, setLastFilters] = useState<{ startDate: string; endDate: string; workerId?: string } | null>(null)

  const handleSearch = async (filters: { startDate: string; endDate: string; workerId?: string }) => {
    setIsLoading(true)
    setLastFilters(filters)

    try {
      // Crear fechas en hora de Perú (UTC-5)
      // startDate: inicio del día en Perú
      // endDate: fin del día en Perú
      const startDate = new Date(`${filters.startDate}T00:00:00-05:00`)
      const endDate = new Date(`${filters.endDate}T23:59:59.999-05:00`)

      const result = await getActivities({
        startDate,
        endDate,
        workerId: filters.workerId,
      })

      setActivities(result)
      setHasSearched(true)
    } catch (error) {
      console.error('Error al buscar:', error)
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSuccess = async () => {
    setShowNewForm(false)
    setActivityToEdit(null)
    if (lastFilters) {
      await handleSearch(lastFilters)
    }
  }

  const handleDelete = async () => {
    if (!activityToDelete) return

    setIsDeleting(true)
    try {
      await deleteActivity(activityToDelete.id)
      setActivityToDelete(null)
      if (lastFilters) {
        await handleSearch(lastFilters)
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsDeleting(false)
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima',
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Trabajo</h1>
        <Button onClick={() => setShowNewForm(true)}>+ Nuevo Registro</Button>
      </div>

      <HistorialFilters workers={workers} onSearch={handleSearch} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Registros</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSearched ? (
            <p className="text-gray-500">Seleccione un rango de fechas y presione Buscar.</p>
          ) : isLoading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">No se encontraron registros para el rango seleccionado.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Costurera</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    {isAdmin && <TableHead>Precio</TableHead>}
                    <TableHead className="w-24">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell>{formatTime(activity.date)}</TableCell>
                      <TableCell>
                        {activity.worker
                          ? `${activity.worker.lastName}, ${activity.worker.firstName}`
                          : '-'}
                      </TableCell>
                      <TableCell className="font-medium">{activity.product?.code || '-'}</TableCell>
                      <TableCell>{activity.product?.name || '-'}</TableCell>
                      <TableCell>
                        {activity.action === ACTIVITY_ACTIONS.FILL ? (
                          <span className="text-green-600">Relleno</span>
                        ) : (
                          <span className="text-amber-600">Confección</span>
                        )}
                      </TableCell>
                      <TableCell>{activity.quantity}</TableCell>
                      {isAdmin && <TableCell>S/ {activity.price.toFixed(2)}</TableCell>}
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActivityToEdit(activity)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setActivityToDelete(activity)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Nuevo Registro */}
      <ActivityForm
        isOpen={showNewForm}
        onClose={() => setShowNewForm(false)}
        onSuccess={handleFormSuccess}
        workers={workers}
        products={products}
      />

      {/* Modal Editar */}
      <Modal
        isOpen={!!activityToEdit}
        onClose={() => setActivityToEdit(null)}
        title="Editar Registro"
      >
        <ActivityEditForm
          activity={activityToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setActivityToEdit(null)}
          workers={workers}
          products={products}
        />
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        isOpen={!!activityToDelete}
        onClose={() => setActivityToDelete(null)}
        title="Confirmar eliminación"
      >
        <p className="mb-6 text-gray-600">
          ¿Está seguro que desea eliminar este registro?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setActivityToDelete(null)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
