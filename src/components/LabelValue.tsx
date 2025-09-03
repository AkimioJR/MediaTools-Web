import React from 'react'

export interface LabelValueProps {
  label: React.ReactNode
  children?: React.ReactNode
  value?: React.ReactNode
  mono?: boolean
  className?: string
}

export default function LabelValue({
  label,
  value,
  children,
  mono = false,
  className = '',
}: LabelValueProps) {
  return (
    <div className={className}>
      <p className="text-[11px] sm:text-xs font-medium text-foreground-500">
        {label}
      </p>
      <p
        className={
          'mt-1 text-[13px] sm:text-sm text-foreground-900 ' +
          (mono ? 'font-mono break-words' : '')
        }
      >
        {value ?? children}
      </p>
    </div>
  )
}
