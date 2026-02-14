'use client'

import { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { createProduct, updateProduct } from '@/actions/products'

interface Product {
  id: string
  code: string
  name: string
  description?: string | null
  makingPriceLow: number | string
  makingPriceHigh: number | string
  fillPrice: number | string
}

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormErrors {
  code?: string
  name?: string
  makingPriceLow?: string
  makingPriceHigh?: string
  fillPrice?: string
  general?: string
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    makingPriceHigh: '',
    makingPriceLow: '',
    fillPrice: '',
  })

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code || '',
        name: product.name || '',
        description: product.description || '',
        makingPriceHigh: String(product.makingPriceHigh) || '',
        makingPriceLow: String(product.makingPriceLow) || '',
        fillPrice: String(product.fillPrice) || '',
      })
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        makingPriceHigh: '',
        makingPriceLow: '',
        fillPrice: '',
      })
    }
    setErrors({})
  }, [product])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Código es requerido'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es requerido'
    }

    if (!formData.makingPriceHigh.trim()) {
      newErrors.makingPriceHigh = 'Precio es requerido'
    } else if (isNaN(Number(formData.makingPriceHigh))) {
      newErrors.makingPriceHigh = 'Precio debe ser numérico'
    }

    if (!formData.makingPriceLow.trim()) {
      newErrors.makingPriceLow = 'Precio es requerido'
    } else if (isNaN(Number(formData.makingPriceLow))) {
      newErrors.makingPriceLow = 'Precio debe ser numérico'
    }

    if (formData.fillPrice && isNaN(Number(formData.fillPrice))) {
      newErrors.fillPrice = 'Precio debe ser numérico'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const data = new FormData()
      data.append('code', formData.code)
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('makingPriceHigh', formData.makingPriceHigh)
      data.append('makingPriceLow', formData.makingPriceLow)
      data.append('fillPrice', formData.fillPrice || '0')

      if (product?.id) {
        await updateProduct(product.id, data)
      } else {
        await createProduct(data)
      }

      onSuccess()
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Error al guardar el producto' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <Input
        label="Código"
        name="code"
        value={formData.code}
        onChange={handleChange}
        error={errors.code}
        required
        disabled={isLoading}
      />

      <Input
        label="Nombre producto"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        disabled={isLoading}
      />

      <Input
        label="Precio confección (alto)"
        name="makingPriceHigh"
        type="number"
        step="0.01"
        value={formData.makingPriceHigh}
        onChange={handleChange}
        error={errors.makingPriceHigh}
        required
        disabled={isLoading}
      />

      <Input
        label="Precio confección (bajo)"
        name="makingPriceLow"
        type="number"
        step="0.01"
        value={formData.makingPriceLow}
        onChange={handleChange}
        error={errors.makingPriceLow}
        required
        disabled={isLoading}
      />

      <Input
        label="Precio de llenado"
        name="fillPrice"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.fillPrice}
        onChange={handleChange}
        error={errors.fillPrice}
        helperText="Dejar en blanco si no aplica"
        disabled={isLoading}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Guardar
        </Button>
      </div>
    </form>
  )
}
