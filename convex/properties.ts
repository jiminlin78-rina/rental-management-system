import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// 列出房東的所有物件
export const listLandlordProperties = query({
  args: {
    landlordId: v.id("landlords"),
  },
  handler: async (ctx, args) => {
    const properties = await ctx.db
      .query("properties")
      .withIndex("by_landlord", (q) => q.eq("landlordId", args.landlordId))
      .collect()

    // 取得每個物件的房間數和物件類型
    const propertiesWithRoomCount = await Promise.all(
      properties.map(async (property) => {
        const rooms = await ctx.db
          .query("rooms")
          .withIndex("by_property", (q) => q.eq("propertyId", property._id))
          .collect()

        // 判斷物件類型：如果所有房間都是整層，就是整層類型；否則是分租
        const hasEntireFloor = rooms.some(r => r.type === "entire_floor")
        const hasShared = rooms.some(r => r.type === "shared")

        // 如果混合類型，優先顯示為分租
        const propertyType = hasShared || !hasEntireFloor ? "shared" : "entire_floor"

        return {
          ...property,
          roomCount: rooms.length,
          propertyType,
          // 計算預估月收入
          totalRent: rooms.reduce((sum, r) => sum + r.monthlyRent, 0),
          // 計算管理費總計
          totalManagementFee: rooms.reduce((sum, r) => sum + (r.managementFee || 0), 0),
        }
      })
    )

    return propertiesWithRoomCount
  },
})

// 取得物件詳情（含房間）
export const getPropertyWithRooms = query({
  args: {
    propertyId: v.union(v.id("properties"), v.string()),
  },
  handler: async (ctx, args) => {
    // 處理字符串 ID 轉換
    const id = typeof args.propertyId === 'string'
      ? ctx.db.normalizeId("properties", args.propertyId)
      : args.propertyId

    if (!id) return null

    const property = await ctx.db.get(id)
    if (!property) return null

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_property", (q) => q.eq("propertyId", id))
      .collect()

    return {
      ...property,
      rooms,
    }
  },
})

// 建立物件（管理員用）
export const createProperty = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    landlordId: v.id("landlords"),
    ragicRecordId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const propertyId = await ctx.db.insert("properties", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
    return propertyId
  },
})

// 更新物件
export const updateProperty = mutation({
  args: {
    propertyId: v.id("properties"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { propertyId, ...updates } = args
    await ctx.db.patch(propertyId, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})
