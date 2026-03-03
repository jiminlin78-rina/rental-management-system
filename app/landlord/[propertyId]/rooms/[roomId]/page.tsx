'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Home, Users } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency } from "@/lib/utils"

type RoomData = {
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

export default function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roomData = useQuery(api.rooms.getRoom, { roomId })
  const deleteRoom = useMutation(api.rooms.deleteRoom)
  const updateRoom = useMutation(api.rooms.updateRoom)

  const [formData, setFormData] = useState<RoomData>({
    type: 'shared',
    floor: '',
    roomNumber: '',
    monthlyRent: '',
    managementFee: '',
    waterFee: '',
    electricityFee: '',
    internetFee: '',
    description: '',
  })

  // 載入房間資料到表單
  useState(() => {
    if (roomData) {
      setFormData({
        type: roomData.type as any,
        floor: roomData.floor,
        roomNumber: roomData.roomNumber || '',
        monthlyRent: roomData.monthlyRent.toString(),
        managementFee: roomData.managementFee.toString(),
        waterFee: (roomData.waterFee || 0).toString(),
        electricityFee: (roomData.electricityFee || 0).toString(),
        internetFee: (roomData.internetFee || 0).toString(),
        description: roomData.description || '',
      })
    }
  })

  // Use useEffect instead
  React.useEffect(() => {
    if (roomData) {
      setFormData({
        type: roomData.type as any,
        floor: roomData.floor,
        roomNumber: roomData.roomNumber || '',
        monthlyRent: roomData.monthlyRent.toString(),
        managementFee: roomData.managementFee.toString(),
        waterFee: (roomData.waterFee || 0).toString(),
        electricityFee: (roomData.electricityFee || 0).toString(),
        internetFee: (roomData.internetFee || 0).toString(),
        description: roomData.description || '',
      })
    }
  }, [roomData])

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">載入中...</div>
      </div>
    )
  }

  const isEntire = roomData.type === 'entire_floor'

  // 編輯模式下顯示表單
  if (isEditing) {
    return (
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              取消
            </button>
            <div className="flex-1">
              <h1 className="font-heading text-lg font-semibold text-primary-text">編輯房間</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-4 py-2 text-sm rounded-xl"
            >
              {saving ? '儲存中...' : '完成'}
            </button>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto space-y-6 pt-4">
          {/* 基本資訊 */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">房間類型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl"
              >
                <option value="shared">分租雅房</option>
                <option value="entire_floor">整層公寓</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">樓層</label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">房間號碼</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl resize-none"
              />
            </div>
          </section>

          {/* 費用 */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">月租金</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">管理費</label>
              <input
                type="number"
                value={formData.managementFee}
                onChange={(e) => setFormData({ ...formData, managementFee: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-bg border border-border-subtle rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-2">水費</label>
                <input
                  type="number"
                  value={formData.waterFee}
                  onChange={(e) => setFormData({ ...formData, waterFee: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary-bg border border-border-subtle rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2">電費</label>
                <input
                  type="number"
                  value={formData.electricityFee}
                  onChange={(e) => setFormData({ ...formData, electricityFee: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary-bg border border-border-subtle rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2">網費</label>
                <input
                  type="number"
                  value={formData.internetFee}
                  onChange={(e) => setFormData({ ...formData, internetFee: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary-bg border border-border-subtle rounded-lg text-sm"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-accent-error/10 border border-accent-error/20 rounded-xl">
              <p className="text-sm text-accent-error">{error}</p>
            </div>
          )}
        </main>
      </div>
    )
  }

  // 查看模式
  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      await updateRoom({
        roomId,
        updates: {
          type: formData.type,
          floor: formData.floor,
          roomNumber: formData.roomNumber,
          monthlyRent: parseInt(formData.monthlyRent),
          managementFee: parseInt(formData.managementFee),
          waterFee: parseInt(formData.waterFee) || 0,
          electricityFee: parseInt(formData.electricityFee) || 0,
          internetFee: parseInt(formData.internetFee) || 0,
          description: formData.description,
        },
      })
      setIsEditing(false)
    } catch (err) {
      console.error('更新失敗:', err)
      setError('更新失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('確定要刪除此房間嗎？此操作無法 undo。')) return

    try {
      await deleteRoom({ roomId })
      window.location.href = `/landlord/${roomData.propertyId}`
    } catch (err: any) {
      alert(err.message || '刪除失敗，請稍後再試')
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href={`/landlord/${roomData.propertyId}`}>
            <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-primary-text">房間詳情</h1>
          </div>
          <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
            <Edit className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          {isEntire ? (
            // 整層顯示
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-gold-primary/20 rounded-lg">
                    <Home className="w-5 h-5 text-gold-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-text">整層公寓</p>
                    <p className="text-xs text-text-muted">{roomData.floor}</p>
                  </div>
                </div>
                {roomData.roomNumber && (
                  <span className="px-2 py-1 bg-border-subtle rounded text-xs font-mono text-text-secondary">
                    {roomData.roomNumber}
                  </span>
                )}
              </div>

              {roomData.description && (
                <p className="text-sm text-text-muted mb-4">{roomData.description}</p>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">租金</span>
                  <span className="font-number font-semibold">{formatCurrency(roomData.monthlyRent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">管理費</span>
                  <span className="font-number">{formatCurrency(roomData.managementFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">水費</span>
                  <span className="font-number">{formatCurrency(roomData.waterFee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">電費</span>
                  <span className="font-number">{formatCurrency(roomData.electricityFee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">網費</span>
                  <span className="font-number">{formatCurrency(roomData.internetFee || 0)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-primary/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">月總額</span>
                  <span className="font-number font-bold text-2xl text-gold-primary">
                    {formatCurrency(
                      roomData.monthlyRent +
                      roomData.managementFee +
                      (roomData.waterFee || 0) +
                      (roomData.electricityFee || 0) +
                      (roomData.internetFee || 0)
                    )}
                  </span>
                </div>
              </div>
            </>
          ) : (
            // 分租顯示
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent-success/20 rounded-lg">
                    <Users className="w-6 h-6 text-accent-success" />
                  </div>
                  <div>
                    {roomData.roomNumber ? (
                      <p className="font-heading text-xl font-semibold text-primary-text">{roomData.roomNumber}</p>
                    ) : (
                      <p className="font-heading text-xl font-semibold text-primary-text">雅房</p>
                    )}
                    <p className="text-sm text-text-muted">{roomData.floor}</p>
                  </div>
                </div>
              </div>

              {roomData.description && (
                <p className="text-sm text-text-muted mb-6">{roomData.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-border-subtle/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted mb-1">月租金</p>
                  <p className="font-number font-bold text-xl text-primary-text">
                    {formatCurrency(roomData.monthlyRent)}
                  </p>
                </div>
                <div className="bg-border-subtle/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted mb-1">管理費</p>
                  <p className="font-number font-bold text-lg text-primary-text">
                    {formatCurrency(roomData.managementFee)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-border-subtle">
                <div>
                  <p className="text-xs text-text-muted">水費</p>
                  <p className="font-number text-sm">{formatCurrency(roomData.waterFee || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">電費</p>
                  <p className="font-number text-sm">{formatCurrency(roomData.electricityFee || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">網費</p>
                  <p className="font-number text-sm">{formatCurrency(roomData.internetFee || 0)}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">月總額</span>
                  <span className="font-number font-bold text-xl text-accent-success">
                    {formatCurrency(
                      roomData.monthlyRent +
                      roomData.managementFee +
                      (roomData.waterFee || 0) +
                      (roomData.electricityFee || 0) +
                      (roomData.internetFee || 0)
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 space-y-3"
        >
          <button onClick={() => setIsEditing(true)} className="card w-full p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="p-2 bg-gold-primary/10 rounded-lg">
              <Edit className="w-4 h-4 text-gold-primary" />
            </div>
            <span className="font-medium text-primary-text">編輯房間</span>
          </button>

          <button onClick={handleDelete} className="card w-full p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="p-2 bg-accent-error/10 rounded-lg">
              <Trash2 className="w-4 h-4 text-accent-error" />
            </div>
            <span className="font-medium text-accent-error">刪除房間</span>
          </button>
        </motion.div>
      </main>
    </div>
  )
}

