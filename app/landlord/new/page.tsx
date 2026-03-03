'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Home, Plus, Building } from "lucide-react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"

type FormData = {
  name: string
  address: string
  propertyType: 'entire_floor' | 'shared'
  initialRoomCount: number
}

export default function NewPropertyPage() {
  const { userId, isLoaded } = useAuth()

  // 取得房東資料
  const user = useQuery(api.users.getUserByClerkId, { clerkId: userId || "" })
  const landlordId = user?.landlordId

  // 新增物件的 mutation
  const createProperty = useMutation(api.properties.createProperty)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    propertyType: 'shared',
    initialRoomCount: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!landlordId) {
      setError('找不到房東資訊')
      return
    }

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('請填寫所有必填欄位')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const propertyId = await createProperty({
        name: formData.name.trim(),
        address: formData.address.trim(),
        landlordId: landlordId as any,
      })

      // 成功後跳轉到物件詳情頁
      window.location.href = `/landlord/${propertyId}`
    } catch (err) {
      console.error('建立物件失敗:', err)
      setError('建立物件失敗，請稍後再試')
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (confirm('確定要離開嗎？已填寫的資料將會遺失')) {
      window.location.href = '/landlord'
    }
  }

  if (!isLoaded || !landlordId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-primary-text">新增物件</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim() || !formData.address.trim()}
            className={`btn-primary px-4 py-2 text-sm rounded-xl ${
              loading || !formData.name.trim() || !formData.address.trim()
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? '儲存中...' : '完成'}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* 物件類型選擇 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading text-base font-semibold text-primary-text mb-3">
            物件類型
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, propertyType: 'shared' })}
              className={`card p-5 text-left transition-all ${
                formData.propertyType === 'shared'
                  ? 'ring-2 ring-accent-success bg-accent-success/5 border-accent-success/20'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${
                  formData.propertyType === 'shared'
                    ? 'bg-accent-success text-white'
                    : 'bg-accent-success/10 text-accent-success'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-primary-text">分租公寓</h3>
                  <p className="text-xs text-text-muted">一間一間出租</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                適合學生或單身族群，每間房間租金較低，管理較繁瑣
              </p>
            </button>

            <button
              onClick={() => setFormData({ ...formData, propertyType: 'entire_floor' })}
              className={`card p-5 text-left transition-all ${
                formData.propertyType === 'entire_floor'
                  ? 'ring-2 ring-gold-primary bg-gold-primary/5 border-gold-primary/20'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${
                  formData.propertyType === 'entire_floor'
                    ? 'bg-gold-primary text-white'
                    : 'bg-gold-primary/10 text-gold-primary'
                }`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-primary-text">整層租賃</h3>
                  <p className="text-xs text-text-muted">整層一起出租</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                適合家庭或小團體，租金較高，管理較簡單
              </p>
            </button>
          </div>
        </motion.section>

        {/* 基本資訊 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <section>
            <h2 className="font-heading text-base font-semibold text-primary-text mb-3">
              基本資訊
            </h2>

            <div className="space-y-4">
              {/* 物件名稱 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  物件名稱 <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：大興大樓 A 棟"
                  className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors"
                  autoFocus
                />
              </div>

              {/* 物件地址 */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  物件地址 <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="例如：高雄市左營區博愛二路 123 號"
                  className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl text-primary-text placeholder-text-muted focus:outline-none focus:border-gold-primary transition-colors"
                />
              </div>
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

          {/* 儲存按鈕（桌面版） */}
          <button
            type="submit"
            disabled={loading || !formData.name.trim() || !formData.address.trim()}
            className={`btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 ${
              loading || !formData.name.trim() || !formData.address.trim()
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? '儲存中...' : '建立物件'}
          </button>
        </motion.form>

        {/* 提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-4 bg-gold-primary/5 border border-gold-primary/20"
        >
          <div className="flex gap-3">
            <Building className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-primary-text font-medium mb-1">
                後續操作
              </p>
              <p className="text-xs text-text-secondary">
                建立物件後，您可以進入物件詳情頁面新增房間、設定租金等資訊。
              </p>
            </div>
          </div>
        </motion.div>
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
