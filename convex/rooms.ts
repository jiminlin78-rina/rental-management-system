import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// 取得物件的所有房間
export const listPropertyRooms = query({
  args: {
    propertyId: v.id("properties"),
  },
  handler: async (ctx, args) => {
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .order("desc")
      .collect()

    return rooms
  },
})

// 取得單一房間詳細資訊
export const getRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)
    return room
  },
})

// 新增房間
export const createRoom = mutation({
  args: {
    propertyId: v.id("properties"),
    type: v.string(),
    floor: v.string(),
    roomNumber: v.string(),
    monthlyRent: v.number(),
    managementFee: v.number(),
    waterFee: v.optional(v.number()),
    electricityFee: v.optional(v.number()),
    internetFee: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const roomId = await ctx.db.insert("rooms", {
      ...args,
      waterFee: args.waterFee || 0,
      electricityFee: args.electricityFee || 0,
      internetFee: args.internetFee || 0,
      createdAt: now,
      updatedAt: now,
    })
    return roomId
  },
})

// 更新房間
export const updateRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    updates: v.object({
      type: v.optional(v.string()),
      floor: v.optional(v.string()),
      roomNumber: v.optional(v.string()),
      monthlyRent: v.optional(v.number()),
      managementFee: v.optional(v.number()),
      waterFee: v.optional(v.number()),
      electricityFee: v.optional(v.number()),
      internetFee: v.optional(v.number()),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, args.updates)
    const now = Date.now()
    await ctx.db.patch(args.roomId, { updatedAt: now })
    return args.roomId
  },
})

// 刪除房間
export const deleteRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)
    if (!room) throw new Error("房間不存在")

    // 檢查是否有房客
    const tenants = await ctx.db
      .query("tenants")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect()

    if (tenants.length > 0) {
      throw new Error("無法刪除：房間已有房客")
    }

    await ctx.db.delete(args.roomId)
  },
})
