'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Switch, MultiSelect } from '@/components/ui'
import { createWorker, updateWorker } from '@/actions/workers'
import { ROLES, OPERATOR_PERMISSIONS, OPERATOR_PERMISSIONS_TEXT } from '@/types'

interface Operator {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  user: string | null
  permission: string | null
}

interface OperatorFormProps {
  operator?: Operator | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phone?: string
  user?: string
  password?: string
  permission?: string
  general?: string
}

const permissionOptions = [
  { value: OPERATOR_PERMISSIONS.MAKES, label: OPERATOR_PERMISSIONS_TEXT[OPERATOR_PERMISSIONS.MAKES] },
  { value: OPERATOR_PERMISSIONS.FILL, label: OPERATOR_PERMISSIONS_TEXT[OPERATOR_PERMISSIONS.FILL] },
  { value: OPERATOR_PERMISSIONS.SCHEDULE, label: OPERATOR_PERMISSIONS_TEXT[OPERATOR_PERMISSIONS.SCHEDULE] },
]

export function OperatorForm({ operator, onSuccess, onCancel }: OperatorFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [changePassword, setChangePassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    user: '',
    password: '',
    permissions: [] as string[],
  })

  const isEdit = !!operator?.id

  useEffect(() => {
    if (operator) {
      setFormData({
        firstName: operator.firstName || '',
        lastName: operator.lastName || '',
        phone: operator.phone || '',
        user: operator.user || '',
        password: '',
        permissions: operator.permission?.split(',').filter(Boolean) || [],
      })
      setChangePassword(false)
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        user: '',
        password: '',
        permissions: [],
      })
    }
    setErrors({})
  }, [operator])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombres son requeridos'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellidos son requeridos'
    }

    if (!formData.user.trim()) {
      newErrors.user = 'Usuario es requerido'
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = 'Contraseña es requerida'
    }

    if (isEdit && changePassword && !formData.password.trim()) {
      newErrors.password = 'Contraseña es requerida'
    }

    if (formData.permissions.length === 0) {
      newErrors.permission = 'Seleccione al menos un permiso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handlePermissionsChange = (permissions: string[]) => {
    setFormData(prev => ({ ...prev, permissions }))
    setErrors(prev => ({ ...prev, permission: undefined }))
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
      data.append('role', ROLES.OPERATOR)
      data.append('user', formData.user)
      data.append('permission', formData.permissions.join(','))

      if (!isEdit || (isEdit && changePassword)) {
        data.append('password', formData.password)
      }

      if (operator?.id) {
        await updateWorker(operator.id, data)
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

      <Input
        label="Usuario para login"
        name="user"
        value={formData.user}
        onChange={handleChange}
        error={errors.user}
        required
        disabled={isLoading}
      />

      <MultiSelect
        label="Permisos"
        options={permissionOptions}
        value={formData.permissions}
        onChange={handlePermissionsChange}
        error={errors.permission}
        placeholder="Seleccionar permisos..."
        required
        disabled={isLoading}
      />

      {isEdit ? (
        <>
          <div className="pt-2">
            <Switch
              name="changePassword"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              label="Cambiar contraseña"
              disabled={isLoading}
            />
          </div>
          {changePassword && (
            <Input
              label="Nueva Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isLoading}
            />
          )}
        </>
      ) : (
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isLoading}
        />
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
