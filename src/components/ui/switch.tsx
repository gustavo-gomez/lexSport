'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id || props.name

    return (
      <label htmlFor={switchId} className="inline-flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className={cn('peer sr-only', className)}
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
        </div>
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export { Switch }
