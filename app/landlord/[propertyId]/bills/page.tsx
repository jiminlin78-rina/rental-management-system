'use client'

import { useState, useMemo } from "react"
import { use } from "react"
import { ArrowLeft, Calendar, DollarSign, FileText, Download, CheckCircle2, XCircle, Clock, RefreshCw, DollarSign as IndianRupee } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function PropertyBillsPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = use(params)

  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // 標記已繳的處理函數
  const handleMarkPaid = async (billId: string) => {
    const bill = filteredBills.find(b => b._id === billId)
    if (!bill) return

    const remainingAmount = bill.amount - bill.paidAmount
    if (remainingAmount <= 0) {
      alert('此帳單已全額繳費')
      return
    }

    if (!confirm(`確認標記已繳 NT${formatCurrency(remainingAmount)}？`)) return

    setMarkingPaid(billId)
    try {
      await markBillPaid({ billId, paidAmount: remainingAmount })
      window.location.reload()
    } catch (err) {
      console.error('標記失敗:', err)
      alert('標記失敗，請稍後再試')
      setMarkingPaid(null)
    }
  }

  // 匯出 CSV
  const handleExportCSV = () => {
    if (filteredBills.length === 0) {
      alert('沒有可匯出的帳單')
      return
    }

    const headers = ['房客', '帳單月份', '房間', '租金', '管理費', '水電費', '總額', '已繳', '未繳', '狀態', '到期日']
    const rows = filteredBills.map(bill => [
      bill.tenantName,
      bill.billMonth,
      bill.roomNumber,
      bill.rentAmount,
      bill.managementFee,
      bill.utilityFee,
      bill.amount,
      bill.paidAmount,
      bill.amount - bill.paidAmount,
      bill.status === 'paid' ? '已繳' : bill.status === 'unpaid' ? '待繳' : '逾期',
      formatDate(bill.dueDate),
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.join(',') + '\n'
    })

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `帳單列表_${selectedMonth === 'all' ? '全部' : selectedMonth}_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
  }

  // 取得物件資訊
  const propertyData = useQuery(api.properties.getPropertyWithRooms, { propertyId: propertyId as any })

  // 批量生成帳單
  const generateBills = useMutation(api.bills.generateMonthlyBills)
  const [generating, setGenerating] = useState(false)

  // 標記帳單已繳
  const markBillPaid = useMutation(api.bills.markBillPaid)
  const [markingPaid, setMarkingPaid] = useState<string | null>(null)

  // 取得所有月份的帳單（暫時用 2026-01 作為初始查詢）
  const allBills = useQuery(
    api.bills.listPropertyMonthlyBills,
    propertyData ? { propertyId: propertyId as any, billMonth: "2026-01" } : "skip"
  )

  // 取得所有月份
  const availableMonths = useMemo(() => {
    if (!allBills) return []
    const months = [...new Set(allBills.map(b => b.billMonth))].sort().reverse()
    return months
  }, [allBills])

  // 篩選帳單
  const filteredBills = useMemo(() => {
    let bills = allBills || []

    // 月份篩選
    if (selectedMonth !== "all") {
      bills = bills.filter(b => b.billMonth === selectedMonth)
    }

    // 狀態篩選
    if (filterStatus !== "all") {
      bills = bills.filter(b => b.status === filterStatus)
    }

    return bills
  }, [allBills, selectedMonth, filterStatus])

  // 統計
  const stats = useMemo(() => {
    const bills = filteredBills
    return {
      total: bills.length,
      unpaid: bills.filter(b => b.status === "unpaid").length,
      paid: bills.filter(b => b.status === "paid").length,
      overdue: bills.filter(b => b.status === "overdue").length,
      totalAmount: bills.reduce((sum, b) => sum + b.amount, 0),
      collectedAmount: bills.reduce((sum, b) => sum + b.paidAmount, 0),
    }
  }, [filteredBills])

  // 生成帳單
  const handleGenerateBills = async (billMonth: string) => {
    if (!confirm(`確定要生成 ${billMonth} 的所有帳單嗎？`)) return

    setGenerating(true)
    try {
      const result = await generateBills({
        propertyId: propertyId as any,
        billMonth,
        dueDayOfMonth: 5,
        paymentAccount: "銀行代碼 007 台灣銀行 帳號 1234-5678-9012",
        paymentNote: "請於繳費期限內完成付款，逾期將酌收延遲金。",
      })

      alert(`成功生成 ${result.created} 筆帳單！`)
      window.location.reload()
    } catch (err) {
      console.error('生成帳單失敗:', err)
      alert('生成帳單失敗，請稍後再試')
    } finally {
      setGenerating(false)
    }
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen pb-24">
        <div className="text-center py-20 text-text-muted">載入中...</div>
      </div>
    )
  }

  const currentMonth = new Date().toISOString().slice(0, 7)

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href={`/landlord/${propertyId}`}>
            <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-primary-text">帳單管理</h1>
            <p className="text-xs text-text-muted">{propertyData.name}</p>
          </div>
          <button
            onClick={() => handleGenerateBills(currentMonth)}
            disabled={generating}
            className="btn-primary px-3 py-2 text-sm rounded-xl flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? '生成中...' : '生成帳單'}
          </button>
        </div>
      </header>

      {/* 篩選器 */}
      <div className="sticky top-[73px] z-40 bg-primary-bg/95 backdrop-blur-md border-b border-border-subtle px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedMonth("all")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              selectedMonth === "all"
                ? "bg-gold-primary text-white"
                : "bg-border-subtle text-text-secondary"
            }`}
          >
            全部月份
          </button>
          {availableMonths.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedMonth === month
                  ? "bg-gold-primary text-white"
                  : "bg-border-subtle text-text-secondary"
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filterStatus === "all"
                ? "bg-accent-success text-white"
                : "bg-border-subtle text-text-secondary"
            }`}
          >
            全部 ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus("unpaid")}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filterStatus === "unpaid"
                ? "bg-gold-primary text-white"
                : "bg-border-subtle text-text-secondary"
            }`}
          >
            待繳 ({stats.unpaid})
          </button>
          <button
            onClick={() => setFilterStatus("paid")}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filterStatus === "paid"
                ? "bg-accent-success text-white"
                : "bg-border-subtle text-text-secondary"
            }`}
          >
            已繳 ({stats.paid})
          </button>
          <button
            onClick={() => setFilterStatus("overdue")}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filterStatus === "overdue"
                ? "bg-accent-error text-white"
                : "bg-border-subtle text-text-secondary"
            }`}
          >
            逾期 ({stats.overdue})
          </button>
        </div>
      </div>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* 統計卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gold-primary" />
              <span className="text-xs text-text-muted">應收總額</span>
            </div>
            <p className="font-number font-bold text-lg text-primary-text">
              {formatCurrency(stats.totalAmount)}
            </p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-accent-success" />
              <span className="text-xs text-text-muted">已收金額</span>
            </div>
            <p className="font-number font-bold text-lg text-accent-success">
              {formatCurrency(stats.collectedAmount)}
            </p>
          </div>
        </motion.div>

        {/* 帳單列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-base font-semibold text-primary-text">帳單列表</h2>
            {filteredBills.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="text-sm text-gold-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Download className="w-4 h-4" />
                匯出 CSV
              </button>
            )}
          </div>

          {filteredBills.length === 0 ? (
            <div className="card p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">沒有符合条件的帳單</p>
              <button
                onClick={() => handleGenerateBills(currentMonth)}
                className="btn-primary mt-4 px-6 py-2 text-sm rounded-xl"
              >
                生成 {currentMonth} 帳單
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBills.map((bill, i) => (
                <motion.div
                  key={bill._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-primary-text">{bill.tenantName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          bill.status === "paid" ? "bg-accent-success/10 text-accent-success" :
                          bill.status === "overdue" ? "bg-accent-error/10 text-accent-error" :
                          "bg-gold-primary/10 text-gold-primary"
                        }`}>
                          {bill.status === "paid" ? "已繳" :
                           bill.status === "overdue" ? "逾期" : "待繳"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {bill.billMonth}
                        </span>
                        <span>{bill.roomNumber}</span>
                      </div>
                    </div>
                    <p className="font-number font-bold text-lg text-primary-text">
                      {formatCurrency(bill.amount)}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs text-center pt-3 border-t border-border-subtle">
                    <div className="bg-border-subtle/50 rounded-lg p-2">
                      <p className="text-text-muted mb-1">租金</p>
                      <p className="font-number font-medium">{formatCurrency(bill.rentAmount)}</p>
                    </div>
                    <div className="bg-border-subtle/50 rounded-lg p-2">
                      <p className="text-text-muted mb-1">管理費</p>
                      <p className="font-number font-medium">{formatCurrency(bill.managementFee)}</p>
                    </div>
                    <div className="bg-border-subtle/50 rounded-lg p-2">
                      <p className="text-text-muted mb-1">水電網</p>
                      <p className="font-number font-medium">{formatCurrency(bill.utilityFee)}</p>
                    </div>
                    <div className="bg-border-subtle/50 rounded-lg p-2">
                      <p className="text-text-muted mb-1">其他</p>
                      <p className="font-number font-medium">{formatCurrency(bill.otherFee)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle">
                    <div className="text-xs text-text-muted">
                      到期日: {formatDate(bill.dueDate)}
                    </div>
                    {bill.status === "paid" ? (
                      <span className="text-xs text-accent-success flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        已繳 {formatCurrency(bill.paidAmount)}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkPaid(bill._id)}
                        disabled={markingPaid === bill._id}
                        className="btn-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        {markingPaid === bill._id ? (
                          '...'
                        ) : (
                          <>
                            <IndianRupee className="w-3 h-3" />
                            標記已繳
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  )
}
