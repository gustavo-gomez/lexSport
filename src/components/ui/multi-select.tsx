'use client'

import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  label?: string
  error?: string
  helperText?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  name?: string
}

export function MultiSelect({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  required,
  disabled,
  name,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (optionValue: string) => {
    if (disabled) return

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex w-full min-h-[42px] items-center justify-between rounded-md border px-3 py-2 shadow-sm transition-colors text-left',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-900'
          )}
        >
          <span className={cn('flex-1', selectedLabels.length === 0 && 'text-gray-400')}>
            {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
          </span>
          <svg
            className={cn('h-5 w-5 text-gray-400 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  name={name}
                  checked={value.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
