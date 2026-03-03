"use client"

import { ReactNode } from "react"
import { Card, TiltCard } from "./Card"
import { cn, formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import { Home, DollarSign, Wallet, CircleDot } from "lucide-react"

export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved"

export interface Room {
  id: string
  roomNumber: string
  rent: number
  managementFee: number
  status: RoomStatus
}

export interface RoomCardProps {
  room: Room
  onClick?: () => void
  tilt?: boolean
  isLoading?: boolean
}

const statusConfig: Record<
  RoomStatus,
  { label: string; color: string; bg: string; icon: ReactNode }
> = {
  available: {
    label: "空房",
    color: "text-accent-success",
    bg: "bg-accent-success/10",
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  occupied: {
    label: "已出租",
    color: "text-gold-primary",
    bg: "bg-gold-primary/10",
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  maintenance: {
    label: "維護中",
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  reserved: {
    label: "已預訂",
    color: "text-gold-dark",
    bg: "bg-gold-primary/20",
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
}

function RoomCardContent({ room }: { room: Room }) {
  const config = statusConfig[room.status]

  return (
    <div className="p-5">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-primary/20 to-gold-dark/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-gold-primary" />
          </div>
          <div>
            <div className="text-text-muted text-xs">房號</div>
            <div className="font-heading text-xl font-semibold bg-gradient-to-r from-gold-primary to-gold-dark bg-clip-text text-transparent">
              {room.roomNumber}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "px-3 py-1.5 rounded-full flex items-center gap-1.5",
            config.bg,
            config.color,
            "text-xs font-medium"
          )}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gold-primary" />
          <div>
            <div className="text-text-muted text-xs">租金</div>
            <div className="text-text-primary font-medium">
              {formatCurrency(room.rent)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gold-primary" />
          <div>
            <div className="text-text-muted text-xs">管理費</div>
            <div className="text-text-primary font-medium">
              {formatCurrency(room.managementFee)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="p-5 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-border-subtle" />
          <div>
            <div className="h-3 w-12 bg-border-subtle rounded mb-2" />
            <div className="h-5 w-16 bg-border-subtle rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-border-subtle rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-subtle">
        <div className="h-12 bg-border-subtle rounded" />
        <div className="h-12 bg-border-subtle rounded" />
      </div>
    </div>
  )
}

export function RoomCard({
  room,
  onClick,
  tilt = false,
  isLoading = false,
}: RoomCardProps) {
  const CardComponent = tilt ? TiltCard : Card

  if (isLoading) {
    return (
      <CardComponent>
        <LoadingSkeleton />
      </CardComponent>
    )
  }

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <div className="card transition-all">
          <RoomCardContent room={room} />
        </div>
      </motion.div>
    )
  }

  return (
    <CardComponent>
      <RoomCardContent room={room} />
    </CardComponent>
  )
}

export default RoomCard
