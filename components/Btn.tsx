import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "btn-base",
          {
            "btn-primary": variant === "primary",
            "btn-secondary": variant === "secondary",
            "btn-ghost": variant === "ghost",
            "btn-sm": size === "sm",
            "btn-md": size === "md",
            "btn-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? <span className="animate-pulse">載入中...</span> : children}
      </button>
    )
  }
)

Btn.displayName = "Btn"

export default Btn
