'use client'

import { useState } from 'react'
import { Button, Input, Select, Modal } from '@/components/ui'
import { createActivities } from '@/actions/activities'
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

interface ActivityFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  workers: Worker[]
  products: Product[]
}

interface ActivityRow {
  workerId: string
  productId: string
  quantity: string
  action: string
}

const emptyRow: ActivityRow = {
  workerId: '',
  productId: '',
  quantity: '',
  action: ACTIVITY_ACTIONS.MAKE,
}

function getPeruDateString(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

export function ActivityForm({ isOpen, onClose, onSuccess, workers, products }: ActivityFormProps) {
  const today = getPeruDateString()
  const [activityDate, setActivityDate] = useState(today)
  const [rows, setRows] = useState<ActivityRow[]>([{ ...emptyRow }])
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const workerOptions = workers.map(w => ({
    value: w.id,
    label: `${w.lastName}, ${w.firstName}`,
  }))

  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.code} - ${p.name}`,
  }))

  const actionOptions = [
    { value: ACTIVITY_ACTIONS.MAKE, label: 'Confección' },
    { value: ACTIVITY_ACTIONS.FILL, label: 'Relleno' },
  ]

  const handleChange = (index: number, field: keyof ActivityRow, value: string) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], [field]: value }
    setRows(newRows)

    // Limpiar error del campo
    if (errors[index]?.[field]) {
      const newErrors = { ...errors }
      delete newErrors[index][field]
      setErrors(newErrors)
    }
  }

  const addRow = () => {
    setRows([...rows, { ...emptyRow }])
  }

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index)
      setRows(newRows)
    }
  }

  const showActionSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product && product.fillPrice > 0
  }

  const validateForm = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {}
    let hasError = false

    rows.forEach((row, index) => {
      const rowErrors: Record<string, string> = {}

      if (!row.workerId) {
        rowErrors.workerId = 'Requerido'
        hasError = true
      }
      if (!row.productId) {
        rowErrors.productId = 'Requerido'
        hasError = true
      }
      if (!row.quantity || parseInt(row.quantity) <= 0) {
        rowErrors.quantity = 'Requerido'
        hasError = true
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors
      }
    })

    setErrors(newErrors)
    return !hasError
  }

  const calculatePrice = (row: ActivityRow): number => {
    const product = products.find(p => p.id === row.productId)
    const worker = workers.find(w => w.id === row.workerId)

    if (!product || !worker) return 0

    const quantity = parseInt(row.quantity) || 0
    let pricePerUnit = 0

    if (row.action === ACTIVITY_ACTIONS.FILL) {
      pricePerUnit = product.fillPrice
    } else {
      pricePerUnit = worker.oldWorker ? product.makingPriceHigh : product.makingPriceLow
    }

    return quantity * pricePerUnit
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setGeneralError('')

    try {
      const activities = rows.map(row => ({
        workerId: row.workerId,
        productId: row.productId,
        quantity: parseInt(row.quantity),
        action: showActionSelect(row.productId) ? row.action : ACTIVITY_ACTIONS.MAKE,
        price: calculatePrice(row),
      }))

      await createActivities(activities, activityDate)

      // Reset form
      setRows([{ ...emptyRow }])
      setActivityDate(getPeruDateString())
      onSuccess()
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRows([{ ...emptyRow }])
    setErrors({})
    setGeneralError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Trabajo" className="max-w-3xl">
      <div className="space-y-4">
        {generalError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{generalError}</div>
        )}

        <Input
          type="date"
          label="Fecha"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
        />

        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={index} className="relative rounded-lg border bg-gray-50 p-4">
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Costurera"
                  value={row.workerId}
                  onChange={(e) => handleChange(index, 'workerId', e.target.value)}
                  options={workerOptions}
                  placeholder="Seleccionar..."
                  error={errors[index]?.workerId}
                  required
                />

                <Select
                  label="Producto"
                  value={row.productId}
                  onChange={(e) => handleChange(index, 'productId', e.target.value)}
                  options={productOptions}
                  placeholder="Seleccionar..."
                  error={errors[index]?.productId}
                  required
                />

                {showActionSelect(row.productId) && (
                  <Select
                    label="Acción"
                    value={row.action}
                    onChange={(e) => handleChange(index, 'action', e.target.value)}
                    options={actionOptions}
                  />
                )}

                <Input
                  type="number"
                  label="Cantidad"
                  value={row.quantity}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  min="1"
                  error={errors[index]?.quantity}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            + Agregar fila
          </Button>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
