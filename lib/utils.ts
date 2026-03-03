import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | number | string): string {
  const d = typeof date === "number" ? new Date(date) : new Date(date)
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatBillMonth(billMonth: string): string {
  const [year, month] = billMonth.split("-")
  return `${parseInt(month)}月 ${year}`
}

export function getDaysUntil(dueDate: number): number {
  const now = Date.now()
  const diff = dueDate - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
