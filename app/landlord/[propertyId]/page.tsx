'use client'

import { useState, useMemo } from "react"
import { use } from "react"
import { ArrowLeft, DollarSign, CheckCircle2, XCircle, X, Home, Users, Plus } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency } from "@/lib/utils"

type Room = {
  _id: string
  type: 'entire_floor' | 'shared'
  floor: string
  roomNumber?: string
  monthlyRent: number
  managementFee: number
  waterFee: number
  electricityFee: number
  internetFee: number
  description?: string
}

type PropertyWithRooms = {
  _id: string
  name: string
  address: string
  landlordId: string
  propertyType: 'entire_floor' | 'shared'
  roomCount: number
  totalRent: number
  totalManagementFee: number
  rooms: Room[]
}

export default function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = use(params)
  const { userId, isLoaded } = useAuth()

  // 開發環境：測試模式
  const isDevelopment = process.env.NODE_ENV === 'development'

  // 取得用戶資料（生產環境需要）
  const user = useQuery(api.users.getUserByClerkId, { clerkId: userId || "" }, isDevelopment ? "skip" : undefined)

  // 取得物件詳情（不依賴 user）
  const propertyData = useQuery(api.properties.getPropertyWithRooms, { propertyId: propertyId as any })

  // 開發環境跳過認證檢查
  if (!isDevelopment && (!isLoaded || !userId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">載入中...</div>
      </div>
    )
  }

  // 如果沒有資料（顯示載入中）
  if (!propertyData) {
    return (
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/landlord">
              <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="font-heading text-lg font-semibold text-primary-text">物件詳情</h1>
              <p className="text-xs text-text-muted">載入中... (ID: {propertyId})</p>
            </div>
          </div>
        </header>
        {isDevelopment && (
          <div className="p-4 text-center text-xs text-text-secondary">
            開發模式 - 測試資料載入中
          </div>
        )}
      </div>
    )
  }

  const property: PropertyWithRooms = {
    ...propertyData,
    propertyType: propertyData.rooms && propertyData.rooms.length > 0 && propertyData.rooms.every((r: any) => r.type === 'entire_floor')
      ? 'entire_floor'
      : 'shared',
    totalRent: propertyData.rooms.reduce((sum: any, r: any) => sum + r.monthlyRent, 0),
    totalManagementFee: propertyData.rooms.reduce((sum: any, r: any) => sum + (r.managementFee || 0), 0),
  }

  const stats = {
    total: property.rooms.length,
    roomsByFloor: useMemo(() => {
      const groups: Record<string, Room[]> = {}
      property.rooms.forEach(room => {
        if (!groups[room.floor]) groups[room.floor] = []
        groups[room.floor].push(room)
      })
      return Object.entries(groups).sort(([a], [b]) => parseInt(b.replace('F', '')) - parseInt(a.replace('F', '')))
    }, [property.rooms]),
  }

  const isEntireFloor = property.propertyType === 'entire_floor'

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/landlord">
            <button className="p-2 hover:bg-border-subtle rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-primary-text truncate">{property.name}</h1>
            <p className="text-xs text-text-muted truncate">{property.address}</p>
          </div>
        </div>

        {/* 物件資訊卡片 */}
        <div className="px-4 pb-3">
          <div className={`card p-4 border ${isEntireFloor ? 'bg-gradient-to-br from-gold-primary/5 to-gold-light/5 border-gold-primary/20' : 'bg-gradient-to-br from-accent-success/5 border-accent-success/20'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isEntireFloor ? (
                  <Home className="w-5 h-5 text-gold-primary" />
                ) : (
                  <Users className="w-5 h-5 text-accent-success" />
                )}
                <span className="font-heading text-base font-semibold text-primary-text">
                  {isEntireFloor ? '整層租賃' : '分租公寓'}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isEntireFloor ? 'bg-gold-primary/10 text-gold-primary' : 'bg-accent-success/10 text-accent-success'}`}>
                {property.rooms.length} 層
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-text-muted mb-1">預估月收入</p>
                <p className={`font-number font-semibold ${isEntireFloor ? 'text-gold-primary' : 'text-accent-success'}`}>
                  {formatCurrency(property.totalRent)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">管理費</p>
                <p className="font-number font-semibold text-primary-text">
                  {formatCurrency(property.totalManagementFee)}
                </p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border-subtle">
              {isEntireFloor ? (
                <span>整層租賃 · 直接顯示每層明細</span>
              ) : (
                <span>分租公寓 · {property.rooms.length} 間雅房</span>
              )}
            </p>
          </div>
        </div>

        {/* 房間統計 */}
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          <div className="card p-2 text-center">
            <p className="text-xs text-text-muted">總計</p>
            <p className="font-heading text-lg font-semibold">{stats.total}</p>
            <p className="text-xs text-text-muted">間</p>
          </div>
          <div className="card p-2 text-center">
            <p className="text-xs text-text-muted">每月總額</p>
            <p className="font-number font-semibold text-sm text-primary-text">
              {formatCurrency(property.totalRent + property.totalManagementFee)}
            </p>
            <p className="text-xs text-text-muted">NTD</p>
          </div>
          <div className="card p-2 text-center">
            <p className="text-xs text-text-muted">均價/月</p>
            <p className="font-number font-semibold text-sm text-accent-success">
              {formatCurrency(Math.round((property.totalRent + property.totalManagementFee) / Math.max(1, stats.total)))}
            </p>
            <p className="text-xs text-text-muted">NTD</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* 功能按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Link href={`/landlord/${property._id}/bills`}>
            <button className="card p-4 text-left hover:shadow-md transition-shadow active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gold-primary/10 text-gold-primary rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-primary-text">帳單管理</p>
                  <p className="text-xs text-text-muted">查看帳單列表</p>
                </div>
              </div>
            </button>
          </Link>
          <Link href={`/landlord/${property._id}/rooms`}>
            <button className="card p-4 text-left hover:shadow-md transition-shadow active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent-success/10 text-accent-success rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-primary-text">新增房間</p>
                  <p className="text-xs text-text-muted">添加新房間</p>
                </div>
              </div>
            </button>
          </Link>
        </motion.div>

        _        <MapView propertyId={propertyId}
          rooms={property.rooms}
          roomsByFloor={stats.roomsByFloor}
          propertyType={property.propertyType}
        />
      </main>
    </div>
  )
}

function MapView({ rooms, roomsByFloor, propertyType, propertyId }: { rooms: Room[]; roomsByFloor: [string, Room[]][]; propertyType: 'entire_floor' | 'shared'; propertyId: string }) {
  return (
    <div className="space-y-6">
      {roomsByFloor.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-8 text-center">
          <p className="text-text-muted">尚無房間資料</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {roomsByFloor.map(([floor, floorRooms], floorIndex) => (
            <motion.div key={floor} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: floorIndex * 0.1 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${propertyType === 'entire_floor' ? 'bg-gold-primary/10 text-gold-primary' : 'bg-accent-success/10 text-accent-success'} font-heading font-bold`}>
                    {floor}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary-text">{floor}</h3>
                    <p className="text-xs text-text-muted">{floorRooms.length} 間</p>
                  </div>
                </div>
              </div>

              {/* 整層：直接展開顯示每個房間明細 */}
              {/* 分租：顯示房間列表圖表 */}
              <div className={`grid ${propertyType === 'entire_floor' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3`}>
                {floorRooms.map((room) => (
                  <Link key={room._id} href={`/landlord/${propertyId}/rooms/${room._id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`card p-4 transition-all hover:shadow-md cursor-pointer ${propertyType === 'entire_floor' ? 'bg-gold-primary/5 border border-gold-primary/10' : 'bg-accent-success/5 border border-accent-success/10'}`}
                    >
                    {propertyType === 'entire_floor' ? (
                      // 整層顯示完整明細
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gold-primary/20 flex items-center justify-center">
                              <Home className="w-5 h-5 text-gold-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-primary-text">整層公寓</p>
                              <p className="text-xs text-text-muted">{floor}</p>
                            </div>
                          </div>
                          {room.roomNumber && (
                            <span className="px-2 py-1 bg-border-subtle rounded text-xs font-mono text-text-secondary">
                              {room.roomNumber}
                            </span>
                          )}
                        </div>

                        {room.description && (
                          <p className="text-xs text-text-muted mb-3">{room.description}</p>
                        )}

                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">租金</span>
                            <span className="font-number font-semibold text-primary-text">{formatCurrency(room.monthlyRent)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">管理費</span>
                            <span className="font-number text-primary-text">{formatCurrency(room.managementFee)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">水費</span>
                            <span className="font-number text-primary-text">{formatCurrency(room.waterFee || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">電費</span>
                            <span className="font-number text-primary-text">{formatCurrency(room.electricityFee || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">網費</span>
                            <span className="font-number text-primary-text">{formatCurrency(room.internetFee || 0)}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gold-primary/10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">月總額</span>
                            <span className="font-number font-bold text-lg text-gold-primary">
                              {formatCurrency(room.monthlyRent + room.managementFee + (room.waterFee || 0) + (room.electricityFee || 0) + (room.internetFee || 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 分租雅房顯示
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent-success/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent-success" />
                        </div>
                        {room.roomNumber ? (
                          <p className="font-medium text-primary-text mb-1">{room.roomNumber}</p>
                        ) : (
                          <p className="text-sm font-medium text-primary-text truncate mb-1">雅房</p>
                        )}
                        <p className="text-xs text-text-muted mb-2">{room.description || '雅房'}</p>
                        <p className="font-number font-semibold text-primary-text">{formatCurrency(room.monthlyRent)}</p>
                        <p className="text-xs text-text-secondary mt-1">{formatCurrency(room.managementFee)} /月</p>
                      </div>
                    )}
                  </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
