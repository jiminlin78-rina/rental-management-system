import { ReactNode, useRef } from "react"
import { motion, MotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
  children: ReactNode
  className?: string
  tilt?: boolean
  hover?: boolean
}

export function Card({ children, className, tilt = false, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "card overflow-hidden transition-all duration-300",
        {
          "tilt-card": tilt,
          "hover:shadow-lg hover:-translate-y-1": hover,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

// 3D Tilt Card 組件
export function TiltCard({ children, className }: Omit<CardProps, "tilt" | "hover">) {
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useSpring(new MotionValue(0), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(new MotionValue(0), { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // 限制旋轉角度 ±8 度
    const maxY = 8
    const maxX = 8

    const rotateXValue = ((y - centerY) / centerY) * maxY
    const rotateYValue = -((x - centerX) / centerX) * maxX

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("tilt-card", className)}
    >
      {children}
    </motion.div>
  )
}

export default Card
