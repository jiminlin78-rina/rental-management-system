import { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary"
}

export function ShimmerButton({ children, variant = "primary", className, ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden px-8 py-3.5 rounded-xl font-medium transition-all duration-250 cursor-pointer",
        "bg-gradient-to-r from-gold-primary to-gold-light text-white",
        "hover:shadow-lg hover:brightness-110 hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export default ShimmerButton
