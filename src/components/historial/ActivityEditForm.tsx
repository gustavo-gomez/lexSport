'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { updateActivity } from '@/actions/activities'
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
}

interface ActivityEditFormProps {
  activity: Activity | null
  onSuccess: () => void
  onCancel: () => void
  workers: Worker[]
  products: Product[]
}

export function ActivityEditForm({ activity, onSuccess, onCancel, workers, products }: ActivityEditFormProps) {
  const [formData, setFormData] = useState({
    workerId: '',
    productId: '',
    quantity: '',
    action: ACTIVITY_ACTIONS.MAKE as string,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    if (activity) {
      setFormData({
        workerId: activity.workerId,
        productId: activity.productId,
        quantity: String(activity.quantity),
        action: activity.action,
      })
    }
  }, [activity])

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

  const showActionSelect = () => {
    const product = products.find(p => p.id === formData.productId)
    return product && product.fillPrice > 0
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.workerId) newErrors.workerId = 'Requerido'
    if (!formData.productId) newErrors.productId = 'Requerido'
    if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculatePrice = (): number => {
    const product = products.find(p => p.id === formData.productId)
    const worker = workers.find(w => w.id === formData.workerId)

    if (!product || !worker) return 0

    const quantity = parseInt(formData.quantity) || 0
    let pricePerUnit = 0

    if (formData.action === ACTIVITY_ACTIONS.FILL) {
      pricePerUnit = product.fillPrice
    } else {
      pricePerUnit = worker.oldWorker ? product.makingPriceHigh : product.makingPriceLow
    }

    return quantity * pricePerUnit
  }

  const handleSubmit = async () => {
    if (!activity || !validateForm()) return

    setIsLoading(true)
    setGeneralError('')

    try {
      await updateActivity(activity.id, {
        workerId: formData.workerId,
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        action: showActionSelect() ? formData.action : ACTIVITY_ACTIONS.MAKE,
        price: calculatePrice(),
      })

      onSuccess()
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Error al actualizar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {generalError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{generalError}</div>
      )}

      <Select
        label="Costurera"
        value={formData.workerId}
        onChange={(e) => handleChange('workerId', e.target.value)}
        options={workerOptions}
        placeholder="Seleccionar..."
        error={errors.workerId}
        required
      />

      <Select
        label="Producto"
        value={formData.productId}
        onChange={(e) => handleChange('productId', e.target.value)}
        options={productOptions}
        placeholder="Seleccionar..."
        error={errors.productId}
        required
      />

      {showActionSelect() && (
        <Select
          label="Acción"
          value={formData.action}
          onChange={(e) => handleChange('action', e.target.value)}
          options={actionOptions}
        />
      )}

      <Input
        type="number"
        label="Cantidad"
        value={formData.quantity}
        onChange={(e) => handleChange('quantity', e.target.value)}
        min="1"
        error={errors.quantity}
        required
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} isLoading={isLoading}>
          Actualizar
        </Button>
      </div>
    </div>
  )
}
