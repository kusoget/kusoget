import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Array<{ value: string; label: string }>
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, value, onValueChange, name, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onValueChange?.(e.target.value)}
              className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
