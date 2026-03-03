import { Card, TiltCard } from "./Card"
import { formatCurrency, getDaysUntil, cn } from "@/lib/utils"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface BillCardProps {
  billMonth: string
  amount: number
  dueDate: number
  status: "paid" | "unpaid" | "overdue" | "partial"
  paymentAccount?: string
  onClick?: () => void
  tilt?: boolean
}

export function BillCard({
  billMonth,
  amount,
  dueDate,
  status,
  paymentAccount,
  onClick,
  tilt = true,
}: BillCardProps) {
  const CardComponent = tilt ? TiltCard : Card
  const daysUntil = getDaysUntil(dueDate)

  const statusConfig = {
    paid: {
      label: "已繳費",
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-accent-success",
      bg: "bg-accent-success/10",
    },
    unpaid: {
      label: daysUntil <= 7 ? "即將到期" : "待繳費",
      icon: <Clock className="w-4 h-4" />,
      color: "text-gold-primary",
      bg: "bg-gold-primary/10",
    },
    overdue: {
      label: "已逾期",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-accent-error",
      bg: "bg-accent-error/10",
    },
    partial: {
      label: "部分繳費",
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-gold-dark",
      bg: "bg-gold-primary/20",
    },
  }

  const config = statusConfig[status]

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <div className="card p-5 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-text-muted text-xs mb-1">{billMonth} 帳單</div>
              <div className="font-heading text-2xl font-semibold bg-gradient-to-r from-gold-primary to-gold-dark bg-clip-text text-transparent">
                {formatCurrency(amount)}
              </div>
            </div>
            <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-1.5", config.bg, config.color, "text-xs font-medium")}>
              {config.icon}
              <span>{config.label}</span>
            </div>
          </div>

          {status !== "paid" && paymentAccount && (
            <div className="space-y-2 pt-4 border-t border-border-subtle">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">繳費期限</span>
                <span className="text-text-secondary font-medium">
                  {new Date(dueDate).toLocaleDateString("zh-TW", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">收款帳號</span>
                <span className="text-text-secondary font-mono">{paymentAccount}</span>
              </div>
            </div>
          )}

          {status === "unpaid" && daysUntil <= 7 && (
            <div className="mt-4 p-3 bg-gold-primary/10 rounded-lg">
              <p className="text-xs text-gold-dark text-center">
                {daysUntil <= 0 ? "已超過繳費期限" : `距到期日還有 ${daysUntil} 天`}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <CardComponent>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-text-muted text-xs mb-1">{billMonth} 帳單</div>
            <div className="font-heading text-2xl font-semibold bg-gradient-to-r from-gold-primary to-gold-dark bg-clip-text text-transparent">
              {formatCurrency(amount)}
            </div>
          </div>
          <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-1.5", config.bg, config.color, "text-xs font-medium")}>
            {config.icon}
            <span>{config.label}</span>
          </div>
        </div>

        {status !== "paid" && paymentAccount && (
          <div className="space-y-2 pt-4 border-t border-border-subtle">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">繳費期限</span>
              <span className="text-text-secondary font-medium">
                {new Date(dueDate).toLocaleDateString("zh-TW", { month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">收款帳號</span>
              <span className="text-text-secondary font-mono">{paymentAccount}</span>
            </div>
          </div>
        )}

        {status === "unpaid" && daysUntil <= 7 && (
          <div className="mt-4 p-3 bg-gold-primary/10 rounded-lg">
            <p className="text-xs text-gold-dark text-center">
              {daysUntil <= 0 ? "已超過繳費期限" : `距到期日還有 ${daysUntil} 天`}
            </p>
          </div>
        )}
      </div>
    </CardComponent>
  )
}

export default BillCard
