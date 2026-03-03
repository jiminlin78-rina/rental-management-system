import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// 用戶角色
export const UserRole = {
  ADMIN: "admin",
  LANDLORD: "landlord",
  TENANT: "tenant",
} as const

// 房間類型
export const RoomType = {
  ENTIRE_FLOOR: "entire_floor", // 整層
  SHARED: "shared", // 分租
} as const

// 帳單狀態
export const BillStatus = {
  UNPAID: "unpaid", // 未繳
  PAID: "paid", // 已繳
  OVERDUE: "overdue", // 逾期
  PARTIAL: "partial", // 部分繳費
} as const

export default defineSchema({
  // 用戶（對應 Clerk User）
  users: defineTable({
    clerkId: v.string(), // Clerk 用戶 ID
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(), // "admin" | "landlord" | "tenant"
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // 房東
  landlords: defineTable({
    userId: v.id("users"), // 對應 users 表
    phone: v.string(),
    lineUserId: v.optional(v.string()), // LINE 通知 ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_line", ["lineUserId"]),

  // 房客
  tenants: defineTable({
    userId: v.id("users"), // 對應 users 表
    phone: v.string(),
    lineUserId: v.optional(v.string()), // LINE 通知 ID
    roomId: v.id("rooms"), // 關聯房間
    leaseStartDate: v.number(),
    leaseEndDate: v.number(),
    emergencyContact: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_room", ["roomId"])
    .index("by_line", ["lineUserId"]),

  // 物件
  properties: defineTable({
    name: v.string(), // 物件名稱
    address: v.string(), // 地址
    landlordId: v.id("landlords"), // 所屬房東
    ragicRecordId: v.optional(v.string()), // Ragic 記錄 ID
    monthlyRent: v.optional(v.number()), // 月租金（整租物件）
    managementFee: v.optional(v.number()), // 管理費
    status: v.optional(v.string()), // 狀態（"已租" | "再媒合" | "空置"）
    propertyManager: v.optional(v.string()), // 物管
    deposit: v.optional(v.number()), // 押金
    leaseStartDate: v.optional(v.number()), // 起租日期
    leaseEndDate: v.optional(v.number()), // 房東租期
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_landlord", ["landlordId"])
    .index("by_ragic", ["ragicRecordId"])
    .index("by_status", ["status"]),

  // 房間
  rooms: defineTable({
    propertyId: v.id("properties"), // 所屬物件
    type: v.string(), // "entire_floor" | "shared"
    floor: v.optional(v.string()), // 樓層
    roomNumber: v.optional(v.string()), // 房號（分租用）
    monthlyRent: v.number(), // 月租金
    managementFee: v.number(), // 管理費
    waterFee: v.number(), // 水費
    electricityFee: v.number(), // 電費
    internetFee: v.number(), // 網路費
    description: v.optional(v.string()), // 描述
    ragicRecordId: v.optional(v.string()), // Ragic 記錄 ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_property", ["propertyId"])
    .index("by_ragic", ["ragicRecordId"]),

  // 帳單
  bills: defineTable({
    tenantId: v.id("tenants"), // 房客
    roomId: v.id("rooms"), // 房間
    propertyId: v.id("properties"), // 物件
    billMonth: v.string(), // 帳單月份 "2026-02"
    dueDate: v.number(), // 繳費期限
    amount: v.number(), // 應繳金額
    rentAmount: v.number(), // 租金
    managementFee: v.number(), // 管理費
    utilityFee: v.number(), // 水電網費
    otherFee: v.number(), // 其他費用
    paidAmount: v.number(), // 已繳金額
    status: v.string(), // "unpaid" | "paid" | "overdue" | "partial"
    paymentAccount: v.string(), // 繳費帳號
    paymentNote: v.optional(v.string()), // 繳費說明
    paidAt: v.optional(v.number()), // 繳費日期
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_property", ["propertyId"])
    .index("by_room", ["roomId"])
    .index("by_month", ["billMonth"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  // Ragic 同步記錄
  ragicSyncLogs: defineTable({
    entityType: v.string(), // "property" | "room" | "tenant"
    ragicRecordId: v.string(),
    convexId: v.string(),
    syncAt: v.number(),
    status: v.string(), // "success" | "failed"
    errorMessage: v.optional(v.string()),
  })
    .index("by_entity", ["entityType", "ragicRecordId"])
    .index("by_date", ["syncAt"]),
})
