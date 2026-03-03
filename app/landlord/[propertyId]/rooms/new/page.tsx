'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Home, Users, Save } from "lucide-react"
import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatDate } from "@/lib/utils"
import { use } from "react"

type FormData = {
  type: 'entire_floor' | 'shared'
  floor: string
  roomNumber: string
  monthlyRent: string
  managementFee: string
  waterFee: string
  electricityFee: string
  internetFee: string
  description: string
}

export default function NewRoomPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = use(params)

  const [formData, setFormData] = useState<FormData>({
    type: 'shared',
    floor: '1F',
    roomNumber: '',
    monthlyRent: '',
    managementFee: '',
    waterFee: '',
    electricityFee: '',
    internetFee: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRoom = useMutation(api.rooms.createRoom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證
    if (!formData.roomNumber.trim()) {
      setError('請輸入房間號碼')
      return
    }

    if (!formData.monthlyRent || !formData.managementFee) {
      setError('請輸入租金和管理費')
      return
    }

    const rentNum = parseInt(formData.monthlyRent)
    if (isNaN(rentNum) || rentNum <= 0) {
      setError('租金必須大於 0')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roomData = {
        propertyId: propertyId as any,
        type: formData.type,
        floor: formData.floor,
        roomNumber: formData.roomNumber.trim(),
        monthlyRent: rentNum,
        managementFee: parseInt(formData.managementFee) || 0,
        waterFee: parseInt(formData.waterFee) || 0,
        electricityFee: parseInt(formData.electricityFee) || 0,
        internetFee: parseInt(formData.internetFee) || 0,
        description: formData.description.trim(),
      }

      await createRoom(roomData)

      // 成功後返回物件詳情頁
      window.location.href = `/landlord/${propertyId}`
    } catch (err) {
      console.error('新增房間失敗:', err)
      setError('新增房間失敗，請稍後再試')
      setLoading(false)
    }
  }

  const isEntire = formData.type === 'entire_floor'

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
            <h1 className="font-heading text-lg font-semibold text-primary-text">新增房間</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? '儲存中...' : '完成'}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* 房間類型 */}
          <section>
            <h2 className="font-heading text-base font-semibold text-primary-text mb-3">
              房間類型
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'shared' })}
                className={`card p-5 text-left transition-all ${
                  formData.type === 'shared'
                    ? 'ring-2 ring-accent-success bg-accent-success/5 border-accent-success/20'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${
                    formData.type === 'shared'
                      ? 'bg-accent-success text-white'
                      : 'bg-accent-success/10 text-accent-success'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-text">分租雅房</h3>
                    <p className="text-xs text-text-muted">適合單身入住</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'entire_floor' })}
                className={`card p-5 text-left transition-all ${
                  formData.type === 'entire_floor'
                    ? 'ring-2 ring-gold-primary bg-gold-primary/5 border-gold-primary/20'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${
                    formData.type === 'entire_floor'
                      ? 'bg-gold-primary text-white'
                      : 'bg-gold-primary/10 text-gold-primary'
                  }`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-text">整層公寓</h3>
                    <p className="text-xs text-text-muted">適合家庭入住</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* 基本資訊 */}
          <section>
            <h2 className="font-heading text-base font-semibold text-primary-text mb-3">
              基本資訊
            </h2>

            <div className="space-y-4">
              {/* 樓層 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  樓層 <span className="text-accent-error">*</span>
                </label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text focus:outline-none focus:border-gold-primary transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(floor => (
                    <option key={floor} value={`${floor}F`}>{floor}F</option>
                  ))}
                </select>
              </div>

              {/* 房間號碼 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  房間號碼 <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder={isEntire ? "例如：101" : "例如：201"}
                  className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors"
                  required
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  房間描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="例如：雅房，近捷運站，附小冷氣"
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* 費用 */}
          <section>
            <h2 className="font-heading text-base font-semibold text-primary-text mb-3">
              費用設定
            </h2>

            <div className="space-y-4">
              {/* 租金 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  月租金 <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">NT$</span>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    placeholder={isEntire ? "18000" : "6500"}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 管理費 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  管理費 <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">NT$</span>
                  <input
                    type="number"
                    value={formData.managementFee}
                    onChange={(e) => setFormData({ ...formData, managementFee: e.target.value })}
                    placeholder={isEntire ? "1500" : "500"}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 水電網 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-2">水費</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">$</span>
                    <input
                      type="number"
                      value={formData.waterFee}
                      onChange={(e) => setFormData({ ...formData, waterFee: e.target.value })}
                      placeholder="300"
                      className="w-full pl-6 pr-2 py-2.5 bg-secondary-bg border border-border-subtle rounded-lg text-primary-text text-sm focus:outline-none focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-2">電費</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">$</span>
                    <input
                      type="number"
                      value={formData.electricityFee}
                      onChange={(e) => setFormData({ ...formData, electricityFee: e.target.value })}
                      placeholder="500"
                      className="w-full pl-6 pr-2 py-2.5 bg-secondary-bg border border-border-subtle rounded-lg text-primary-text text-sm focus:outline-none focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-2">網費</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">$</span>
                    <input
                      type="number"
                      value={formData.internetFee}
                      onChange={(e) => setFormData({ ...formData, internetFee: e.target.value })}
                      placeholder="200"
                      className="w-full pl-6 pr-2 py-2.5 bg-secondary-bg border border-border-subtle rounded-lg text-primary-text text-sm focus:outline-none focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 月總額預覽 */}
              {formData.monthlyRent || formData.managementFee || formData.waterFee || formData.electricityFee || formData.internetFee ? (
                <div className="card p-4 bg-gold-primary/5 border border-gold-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">預估月總額</span>
                    <span className="font-number font-bold text-xl text-gold-primary">
                      {formatCurrency(
                        (parseInt(formData.monthlyRent) || 0) +
                        (parseInt(formData.managementFee) || 0) +
                        (parseInt(formData.waterFee) || 0) +
                        (parseInt(formData.electricityFee) || 0) +
                        (parseInt(formData.internetFee) || 0)
                      )}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* 錯誤訊息 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-accent-error/10 border border-accent-error/20 rounded-xl"
            >
              <p className="text-sm text-accent-error">{error}</p>
            </motion.div>
          )}

          {/* 提交按鈕 */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? '儲存中...' : '新增房間'}
          </button>
        </motion.form>
      </main>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
