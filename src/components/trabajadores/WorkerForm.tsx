'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Select, Switch } from '@/components/ui'
import { createWorker, updateWorker } from '@/actions/workers'
import { ROLES } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  role: string | null
  oldWorker: number
}

interface WorkerFormProps {
  worker?: Worker | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  general?: string
}

const roleOptions = [
  { value: ROLES.COSTURERA, label: 'Costurera' },
  { value: ROLES.JORNALERO, label: 'Jornalero' },
]

export function WorkerForm({ worker, onSuccess, onCancel }: WorkerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: ROLES.COSTURERA as string,
    oldWorker: false,
  })

  useEffect(() => {
    if (worker) {
      setFormData({
        firstName: worker.firstName || '',
        lastName: worker.lastName || '',
        phone: worker.phone || '',
        role: worker.role || ROLES.COSTURERA,
        oldWorker: worker.oldWorker === 1,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        role: ROLES.COSTURERA,
        oldWorker: false,
      })
    }
    setErrors({})
  }, [worker])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombres son requeridos'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellidos son requeridos'
    }

    if (!formData.role) {
      newErrors.role = 'Tipo de trabajador es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, oldWorker: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const data = new FormData()
      data.append('firstName', formData.firstName)
      data.append('lastName', formData.lastName)
      data.append('phone', formData.phone)
      data.append('role', formData.role)
      data.append('oldWorker', formData.oldWorker ? 'true' : 'false')

      if (worker?.id) {
        await updateWorker(worker.id, data)
      } else {
        await createWorker(data)
      }

      onSuccess()
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Error al guardar' })
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
        label="Nombres"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        required
        disabled={isLoading}
      />

      <Input
        label="Apellidos"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        required
        disabled={isLoading}
      />

      <Input
        label="Celular"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        disabled={isLoading}
      />

      {!worker && (
        <Select
          label="Tipo de trabajador"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          error={errors.role}
          required
          disabled={isLoading}
        />
      )}

      {formData.role === ROLES.COSTURERA && (
        <div className="pt-2">
          <Switch
            name="oldWorker"
            checked={formData.oldWorker}
            onChange={handleSwitchChange}
            label="Costurera con experiencia"
            disabled={isLoading}
          />
        </div>
      )}

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
