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
import { OperatorForm } from './OperatorForm'
import { deleteWorker } from '@/actions/workers'
import { useRouter } from 'next/navigation'
import { OPERATOR_PERMISSIONS_TEXT } from '@/types'

interface Operator {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  user: string | null
  permission: string | null
}

interface OperadoresClientProps {
  operators: Operator[]
}

export function OperadoresClient({ operators }: OperadoresClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [operatorToEdit, setOperatorToEdit] = useState<Operator | null>(null)
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (operator: Operator) => {
    setOperatorToEdit(operator)
    setShowForm(true)
  }

  const handleNew = () => {
    setOperatorToEdit(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setOperatorToEdit(null)
    router.refresh()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setOperatorToEdit(null)
  }

  const handleDelete = async () => {
    if (!operatorToDelete) return
    setIsDeleting(true)
    try {
      await deleteWorker(operatorToDelete.id)
      setOperatorToDelete(null)
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

  const formatPermissions = (permission: string | null) => {
    if (!permission) return '-'
    const permissions = permission.split(',')
    return permissions
      .map((p) => OPERATOR_PERMISSIONS_TEXT[p as keyof typeof OPERATOR_PERMISSIONS_TEXT])
      .filter(Boolean)
      .join(', ')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Operadores</h1>
        <Button onClick={handleNew}>+ Nuevo Operador</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Operadores</CardTitle>
        </CardHeader>
        <CardContent>
          {operators.length === 0 ? (
            <p className="text-gray-500">No hay operadores registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((operator, index) => (
                  <TableRow key={operator.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {formatName(operator.firstName, operator.lastName)}
                    </TableCell>
                    <TableCell>{operator.user || '-'}</TableCell>
                    <TableCell>{operator.phone || '-'}</TableCell>
                    <TableCell>{formatPermissions(operator.permission)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(operator)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setOperatorToDelete(operator)}
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

      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={operatorToEdit ? 'Editar Operador' : 'Nuevo Operador'}
      >
        <OperatorForm
          operator={operatorToEdit}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      <Modal
        isOpen={!!operatorToDelete}
        onClose={() => setOperatorToDelete(null)}
        title="Confirmar eliminación"
      >
        <p className="mb-6 text-gray-600">
          ¿Está seguro que desea eliminar al operador{' '}
          <strong>
            {operatorToDelete
              ? formatName(operatorToDelete.firstName, operatorToDelete.lastName)
              : ''}
          </strong>
          ?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOperatorToDelete(null)}
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
