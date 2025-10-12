'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: string | number
  unit?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export function TokenPill({ label, value, unit, variant = 'default', className }: Props) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-900 border-gray-300',
    success: 'bg-green-100 text-green-900 border-green-300',
    warning: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    error: 'bg-red-100 text-red-900 border-red-300'
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono font-semibold">
        {value}{unit}
      </span>
    </div>
  )
}

