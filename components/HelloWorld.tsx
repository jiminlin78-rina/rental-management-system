import { useState, useCallback, MouseEvent, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface HelloWorldProps {
  className?: string
  initialCount?: number
  onCountChange?: (count: number) => void
}

interface CounterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "increment" | "decrement"
}

export function HelloWorld({
  className,
  initialCount = 0,
  onCountChange,
}: HelloWorldProps) {
  const [count, setCount] = useState<number>(initialCount)

  const handleIncrement = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const newCount = count + 1
      setCount(newCount)
      onCountChange?.(newCount)
    },
    [count, onCountChange]
  )

  const handleDecrement = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const newCount = Math.max(0, count - 1)
      setCount(newCount)
      onCountChange?.(newCount)
    },
    [count, onCountChange]
  )

  const handleReset = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setCount(0)
      onCountChange?.(0)
    },
    [onCountChange]
  )

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md",
        className
      )}
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Hello World</h1>
      
      <div className="flex items-center gap-4 mb-4">
        <CounterButton
          onClick={handleDecrement}
          disabled={count === 0}
          variant="decrement"
        >
          −
        </CounterButton>
        
        <span className="text-4xl font-semibold text-gray-700 min-w-[3ch] text-center">
          {count}
        </span>
        
        <CounterButton onClick={handleIncrement} variant="increment">
          +
        </CounterButton>
      </div>

      <button
        onClick={handleReset}
        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Reset
      </button>
    </div>
  )
}

function CounterButton({
  className,
  variant,
  children,
  ...props
}: CounterButtonProps) {
  return (
    <button
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium transition-all",
        "hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variant === "increment"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-red-500 text-white hover:bg-red-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default HelloWorld
