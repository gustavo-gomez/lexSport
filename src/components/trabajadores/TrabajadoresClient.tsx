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
import { WorkerForm } from './WorkerForm'
import { deleteWorker } from '@/actions/workers'
import { useRouter } from 'next/navigation'
import { ROLES } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  role: string | null
  oldWorker: number
}

interface TrabajadoresClientProps {
  workers: Worker[]
}

export function TrabajadoresClient({ workers }: TrabajadoresClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null)
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (worker: Worker) => {
    setWorkerToEdit(worker)
    setShowForm(true)
  }

  const handleNew = () => {
    setWorkerToEdit(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setWorkerToEdit(null)
    router.refresh()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setWorkerToEdit(null)
  }

  const handleDelete = async () => {
    if (!workerToDelete) return
    setIsDeleting(true)
    try {
      await deleteWorker(workerToDelete.id)
      setWorkerToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatName = (firstName: string, lastName: string) => {
    return `${lastName}, ${firstName}`
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Trabajadores</h1>
        <Button onClick={handleNew}>+ Nuevo Trabajador</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Trabajadores</CardTitle>
        </CardHeader>
        <CardContent>
          {workers.length === 0 ? (
            <p className="text-gray-500">No hay trabajadores registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Experiencia</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker, index) => (
                  <TableRow key={worker.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {formatName(worker.firstName, worker.lastName)}
                    </TableCell>
                    <TableCell>
                      {worker.role === ROLES.COSTURERA ? (
                        <span className="text-pink-600">Costurera</span>
                      ) : (
                        <span className="text-blue-600">Jornalero</span>
                      )}
                    </TableCell>
                    <TableCell>{worker.phone || '-'}</TableCell>
                    <TableCell>
                      {worker.role === ROLES.COSTURERA
                        ? worker.oldWorker === 1
                          ? 'Sí'
                          : 'No'
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(worker)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setWorkerToDelete(worker)}
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
          )}
        </CardContent>
      </Card>

      {/* Modal Formulario */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={workerToEdit ? 'Editar Trabajador' : 'Nuevo Trabajador'}
      >
        <WorkerForm
          worker={workerToEdit}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        isOpen={!!workerToDelete}
        onClose={() => setWorkerToDelete(null)}
        title="Confirmar eliminación"
      >
        <p className="mb-6 text-gray-600">
          ¿Está seguro que desea eliminar al trabajador{' '}
          <strong>
            {workerToDelete
              ? formatName(workerToDelete.firstName, workerToDelete.lastName)
              : ''}
          </strong>
          ?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setWorkerToDelete(null)}
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
