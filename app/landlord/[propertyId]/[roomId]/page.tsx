'use client'

import { use } from "react"
import { ArrowLeft, Edit, Plus, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import ShimmerButton from "@/components/ShimmerButton"

// 模擬房間記錄（根據 propertyId 匹配）
const mockRoomDetails: Record<string, any> = {
  // 整層範例
  "room-1": {
    id: "room-1",
    type: "entire",
    name: "整層公寓",
    floor: "5F",
    property: {
      id: "prop-1",
      name: "信義區 A 棟",
      address: "台北市信義區信義路五段",
    },
    monthlyRent: 28000,
    managementFee: 1500,
    utilityFee: 1000,
    status: "occupied",
    tenant: {
      name: "王小明",
      phone: "0912-345-678",
      email: "wang@example.com",
      leaseStart: "2024-01-01",
      leaseEnd: "2025-12-31",
      deposit: 56000,
    },
    features: ["3房2廳", "附家電", "可養寵", "含車位"],
    area: "25坪",
  },
  // 分租範例
  "room-2": {
    id: "room-2",
    type: "shared",
    name: "雅房 A",
    floor: "3F",
    roomNumber: "301",
    property: {
      id: "prop-1",
      name: "信義區 A 棟",
      address: "台北市信義區信義路五段",
    },
    monthlyRent: 8500,
    managementFee: 500,
    utilityFee: 800,
    internetFee: 400,
    status: "occupied",
    tenant: {
      name: "張小華",
      phone: "0987-654-321",
      email: "zhang@example.com",
      leaseStart: "2025-01-01",
      leaseEnd: "2026-03-31",
      deposit: 17000,
    },
    features: ["獨立出入", "含網路", "可做輕食", "共享樓頂"],
    area: "6坪",
  },
  // 空置分租
  "room-3": {
    id: "room-3",
    type: "shared",
    name: "雅房 B",
    floor: "3F",
    roomNumber: "302",
    property: {
      id: "prop-1",
      name: "信義區 A 棟",
      address: "台北市信義區信義路五段",
    },
    monthlyRent: 9000,
    managementFee: 500,
    utilityFee: 800,
    internetFee: 400,
    status: "vacant",
    tenant: null,
    features: ["獨立衛浴", "附冷氣", "可養貓", "靠近捷運"],
    area: "7坪",
  },
}

type RoomType = 'entire' | 'shared'
type Status = 'occupied' | 'vacant'

export default function RoomDetailPage({ params }: { params: Promise<{ propertyId: string; roomId: string }> }) {
  const { propertyId, roomId } = use(params)
  const room = mockRoomDetails[roomId]

  if (!room) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-text-muted">找不到此房間</p>
          <Link href={`/landlord/${propertyId}`} className="inline-block mt-4 text-gold-primary">
            返回物件 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href={`/landlord/${propertyId}`}>
            <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-primary-text">{room.name}</h1>
            <p className="text-xs text-text-muted">{room.property.name}</p>
          </div>
          <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
            <Edit className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* 房間類型卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card p-6 ${room.type === 'entire' ? 'bg-purple-50' : 'bg-blue-50'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              room.type === 'entire' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {room.type === 'entire' ? '🏠' : '🚪'}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary-text">
                {room.type === 'entire' ? '整層出租' : '分租雅房'}
              </h2>
              <p className="text-sm text-text-muted">{room.floor} {room.roomNumber ? `· ${room.roomNumber}` : ''} · {room.area}</p>
            </div>
          </div>

          {/* 費用明細 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">月租金</span>
              <span className="font-number font-semibold text-primary-text">
                ${room.monthlyRent.toLocaleString()}
              </span>
            </div>
            {room.managementFee && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">管理費</span>
                <span className="font-number text-primary-text">
                  ${room.managementFee.toLocaleString()}
                </span>
              </div>
            )}
            {room.type === 'shared' && room.internetFee && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">網路費</span>
                <span className="font-number text-primary-text">
                  ${room.internetFee.toLocaleString()}
                </span>
              </div>
            )}
            {room.utilityFee && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">水電費</span>
                <span className="font-number text-primary-text">
                  ${room.utilityFee.toLocaleString()}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-border-subtle flex justify-between items-center">
              <span className="text-sm font-medium text-primary-text">總計</span>
              <span className="font-number font-semibold text-lg text-gradient-gold">
                ${(room.monthlyRent + room.managementFee + (room.utilityFee || 0) + (room.internetFee || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 設施特色 */}
        {room.features && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5"
          >
            <h3 className="font-heading text-base font-semibold text-primary-text mb-3">設施特色</h3>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gold-primary/10 text-gold-primary rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 租客資訊 - 只有已出租時顯示 */}
        {room.status === 'occupied' && room.tenant && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-5"
            >
              <h3 className="font-heading text-base font-semibold text-primary-text mb-4">租客資訊</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">姓名</p>
                  <p className="font-medium text-primary-text">{room.tenant.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">電話</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-primary" />
                      <p className="text-sm text-primary-text">{room.tenant.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-primary" />
                      <p className="text-sm text-primary-text">{room.tenant.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-subtle">
                  <div>
                    <p className="text-xs text-text-muted mb-1">合約開始</p>
                    <p className="text-sm font-medium text-primary-text">{room.tenant.leaseStart} 起</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">合約到期</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-primary" />
                      <p className="text-sm font-medium text-primary-text">{room.tenant.leaseEnd}</p>
                    </div>
                  </div>
                </div>
                {room.tenant.deposit && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">押金</p>
                    <p className="text-sm font-number font-semibold text-primary-text">
                      ${room.tenant.deposit.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 快捷按鈕 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              <button className="btn-primary">
                發送帳單
              </button>
              <button className="btn-secondary">
                聯繫租客
              </button>
            </motion.div>
          </>
        )}

        {/* 空置狀態 - 只有空置時顯示 */}
        {room.status === 'vacant' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gold-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-primary-text mb-2">
              目前空置中
            </h3>
            <p className="text-sm text-text-muted mb-6">
              {room.type === 'entire' ? '整層公寓目前沒有租客' : '此雅房目前沒有租客'}
            </p>
            <ShimmerButton>新增出租契約</ShimmerButton>
          </motion.div>
        )}

        {/* 物件資訊 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <h3 className="font-heading text-base font-semibold text-primary-text mb-3">物件資訊</h3>
          <p className="text-sm text-primary-text mb-1">{room.property.name}</p>
          <p className="text-sm text-text-muted">{room.property.address}</p>
        </motion.div>
      </main>
    </div>
  )
}
