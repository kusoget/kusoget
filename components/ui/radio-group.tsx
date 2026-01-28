import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: Array<{ value: string; label: string }>
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, value, onValueChange, name, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("flex flex-wrap gap-2", className)} 
        {...props}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onValueChange?.(option.value)}
            className={cn(
              "transition-all",
              value === option.value && "bg-primary text-primary-foreground"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
