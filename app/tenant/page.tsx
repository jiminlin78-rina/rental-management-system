'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Clock, CheckCircle2, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatDate } from "@/lib/utils"

function TenantDashboardContent() {
  const { userId, isLoaded } = useAuth()

  // 開發模式：使用測試房客
  const useTestData = process.env.NODE_ENV === "development"
  const testTenant = useQuery(api.users.getFirstTenant, useTestData ? {} : "skip")

  // 獲取測試房客的 tenantId（需要從 users 表再查一次）
  const testTenantData = useQuery(
    api.users.getUserByClerkId,
    useTestData && testTenant ? { clerkId: testTenant.clerkId || "" } : "skip"
  )

  // 使用 Convex 查询用戶資料
  const user = useQuery(api.users.getUserByClerkId, { clerkId: userId || "" })

  // 決定使用的 tenantId
  const tenantId = useTestData && testTenantData
    ? testTenantData.tenantId
    : user?.tenantId

  // 用戶顯示名稱
  const displayName = useTestData && testTenant
    ? testTenant.name || "測試房客"
    : user?.name || "房客"

  // 計算當前月份
  const currentMonth = new Date().toISOString().slice(0, 7) // "2026-02"

  // 查询房客當月帳單
  const currentBill = useQuery(
    api.bills.getTenantMonthlyBill,
    tenantId ? { tenantId: tenantId as any, billMonth: currentMonth } : "skip"
  )

  // 查询房客所有帳單
  const allBills = useQuery(
    api.bills.listTenantBills,
    tenantId ? { tenantId: tenantId as any } : "skip"
  )

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">載入中...</div>
      </div>
    )
  }

  // 如果用戶資料還沒載入
  if (!user && !testTenant) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex gap-x-2 items-center text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-primary"></span>
          </span>
          <span>載入用戶資料中...</span>
        </div>
      </div>
    )
  }

  // 如果沒有帳單顯示空狀態
  if (!currentBill && (!allBills || allBills.length === 0)) {
    return (
      <div className="min-h-screen bg-primary-bg pb-24">
        <header className="sticky top-0 z-40 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </button>
            </Link>
            <div>
              <h1 className="font-heading text-xl font-semibold text-primary-text">我的帳單</h1>
              <p className="text-xs text-text-muted">歡迎回來，{displayName}</p>
            </div>
            {useTestData && (
              <span className="px-2 py-1 bg-gold-primary/10 text-gold-primary rounded-full text-xs font-medium">
                測試模式
              </span>
            )}
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
        >
          <div className="w-20 h-20 bg-gold-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-gold-primary" />
          </div>
          <h2 className="font-heading text-xl font-medium text-primary-text mb-2">
            還沒有帳單
          </h2>
          <p className="text-sm text-text-muted">
            帳單生成後會顯示在這裡
          </p>
        </motion.div>
      </div>
    )
  }

  // 當月帳單（如果有）
  const currentBillData = currentBill || (allBills?.[0].billMonth === currentMonth ? allBills[0] : null)

  // 計算距離到期天數
  const daysUntil = currentBill?.dueDate
    ? Math.ceil((currentBill.dueDate - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-primary-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </Link>
          <div>
            <h1 className="font-heading text-xl font-semibold text-primary-text">我的帳單</h1>
            <p className="text-xs text-text-muted">
              {currentBillData ? `${currentBillData.billMonth}月份帳單` : "歡迎回來，" + displayName}
            </p>
          </div>
          {useTestData && (
            <span className="px-2 py-1 bg-gold-primary/10 text-gold-primary rounded-full text-xs font-medium">
              測試模式
            </span>
          )}
        </div>
      </header>

      <main className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Current Bill - Large Card */}
        {currentBillData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 shadow-tilt"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-text-muted text-sm">{currentBillData.billMonth} 帳單</span>
              {currentBillData.status === "paid" ? (
                <span className="px-3 py-1 bg-accent-success/10 text-accent-success rounded-full text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  已繳費
                </span>
              ) : (
                <span className={`px-3 py-1 ${
                  daysUntil !== null && daysUntil <= 7 && daysUntil > 0 ? 'bg-accent-error/10 text-accent-error' :
                  daysUntil !== null && daysUntil <= 0 ? 'bg-accent-error/10 text-accent-error' :
                  'bg-gold-primary/10 text-gold-primary'
                } rounded-full text-xs font-medium flex items-center gap-1.5`}>
                  <Clock className="w-3.5 h-3.5" />
                  {currentBillData.status === "paid" ? "已繳費" :
                   currentBillData.status === "overdue" ? "已逾期" :
                   daysUntil !== null && daysUntil <= 0 ? "已逾期" :
                   daysUntil !== null && daysUntil <= 7 ? "即將到期" : "待繳費"}
                </span>
              )}
            </div>

            <div className="text-center mb-8">
              <div className="text-text-muted text-sm mb-2">應繳金額</div>
              <div className="font-heading text-5xl font-bold text-gradient-gold">
                {formatCurrency(currentBillData.amount)}
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 mb-6">
              {[
                { label: "租金", amount: currentBillData.rentAmount },
                { label: "管理費", amount: currentBillData.managementFee },
                { label: "水電網", amount: currentBillData.utilityFee },
                { label: "其他", amount: currentBillData.otherFee },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border-subtle last:border-0">
                  <span className="text-text-secondary text-sm">{item.label}</span>
                  <span className="font-number font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>

            {/* Payment Info */}
            {currentBillData.status !== "paid" && (
              <div className="space-y-4 pt-4 border-t border-border-subtle">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gold-primary" />
                    <span className="text-sm text-text-secondary">繳費期限</span>
                  </div>
                  <p className="text-lg font-medium text-primary-text">
                    {formatDate(currentBillData.dueDate)}
                    {daysUntil !== null && daysUntil > 0 && daysUntil <= 7 && (
                      <span className="ml-2 text-xs text-accent-error">（還剩 {daysUntil} 天）</span>
                    )}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gold-primary" />
                    <span className="text-sm text-text-secondary">收款帳號</span>
                  </div>
                  <p className="text-lg font-number font-medium text-primary-text bg-border-subtle rounded-lg p-2.5">
                    {currentBillData.paymentAccount}
                  </p>
                </div>

                {currentBillData.paymentNote && (
                  <p className="text-xs text-text-muted bg-gold-primary/5 rounded-lg p-3">
                    💡 {currentBillData.paymentNote}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Payment History */}
        {allBills && allBills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-lg font-semibold text-primary-text mb-4">
              繳費記錄
            </h2>

            <div className="space-y-3">
              {allBills
                .filter(b => b._id !== currentBillData?._id) // 排除當月帳單
                .slice(0, 10) // 最多顯示 10 筆
                .map((payment, i) => (
                  <motion.div
                    key={payment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="card p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${
                        payment.status === "paid" ? "bg-accent-success/10 text-accent-success" :
                        payment.status === "overdue" ? "bg-accent-error/10 text-accent-error" :
                        "bg-gold-primary/10 text-gold-primary"
                      } rounded-full`}>
                        {payment.status === "paid" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-text">{payment.billMonth} 帳單</p>
                        <p className="text-xs text-text-muted">
                          {payment.paidAt ? formatDate(payment.paidAt) : `到期：${formatDate(payment.dueDate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-number font-semibold text-primary-text">
                        {formatCurrency(payment.amount)}
                      </span>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        payment.status === "paid" ? "bg-accent-success/10 text-accent-success" :
                        payment.status === "overdue" ? "bg-accent-error/10 text-accent-error" :
                        "bg-gold-primary/10 text-gold-primary"
                      }`}>
                        {payment.status === "paid" ? "已繳" :
                         payment.status === "overdue" ? "逾期" : "待繳"}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}

export default function TenantDashboard() {
  return <TenantDashboardContent />
}
