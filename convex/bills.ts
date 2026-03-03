import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// 取得房客當月帳單
export const getTenantMonthlyBill = query({
  args: {
    tenantId: v.id("tenants"),
    billMonth: v.string(), // "2026-02"
  },
  handler: async (ctx, args) => {
    const bill = await ctx.db
      .query("bills")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .filter((q) => q.eq(q.field("billMonth"), args.billMonth))
      .first()

    return bill ?? null
  },
})

// 列出房客所有帳單
export const listTenantBills = query({
  args: {
    tenantId: v.id("tenants"),
  },
  handler: async (ctx, args) => {
    const bills = await ctx.db
      .query("bills")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .collect()

    return bills
  },
})

// 列出物件某月份的所有帳單（房東對帳用）
export const listPropertyMonthlyBills = query({
  args: {
    propertyId: v.id("properties"),
    billMonth: v.string(),
  },
  handler: async (ctx, args) => {
    const bills = await ctx.db
      .query("bills")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .filter((q) => q.eq(q.field("billMonth"), args.billMonth))
      .collect()

    // 關聯房客資訊
    const billsWithTenants = await Promise.all(
      bills.map(async (bill) => {
        const tenant = await ctx.db.get(bill.tenantId)
        const user = tenant ? await ctx.db.get(tenant.userId) : null
        const room = await ctx.db.get(bill.roomId)

        return {
          ...bill,
          tenantName: user?.name ?? "未知房客",
          roomNumber: room?.roomNumber ?? room?.floor ?? "-",
        }
      })
    )

    return billsWithTenants
  },
})

// 建立帳單
export const createBill = mutation({
  args: {
    tenantId: v.id("tenants"),
    roomId: v.id("rooms"),
    propertyId: v.id("properties"),
    billMonth: v.string(),
    dueDate: v.number(),
    amount: v.number(),
    rentAmount: v.number(),
    managementFee: v.number(),
    utilityFee: v.number(),
    otherFee: v.number(),
    paymentAccount: v.string(),
    paymentNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const billId = await ctx.db.insert("bills", {
      ...args,
      paidAmount: 0,
      status: "unpaid",
      createdAt: now,
      updatedAt: now,
    })
    return billId
  },
})

// 標記帳單已繳
export const markBillPaid = mutation({
  args: {
    billId: v.id("bills"),
    paidAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const bill = await ctx.db.get(args.billId)
    if (!bill) throw new Error("帳單不存在")

    const newPaidAmount = bill.paidAmount + args.paidAmount
    const status = newPaidAmount >= bill.amount ? "paid" : "partial"

    await ctx.db.patch(args.billId, {
      paidAmount: newPaidAmount,
      status,
      paidAt: Date.now(),
      updatedAt: Date.now(),
    })

    return { billId: args.billId, status, paidAmount: newPaidAmount }
  },
})

// 自動更新逾期帳單（cron 用）
export const updateOverdueBills = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const unpaidBills = await ctx.db
      .query("bills")
      .withIndex("by_status", (q) => q.eq("status", "unpaid"))
      .collect()

    let updatedCount = 0
    for (const bill of unpaidBills) {
      if (bill.dueDate < now) {
        await ctx.db.patch(bill._id, {
          status: "overdue",
          updatedAt: now,
        })
        updatedCount++
      }
    }

    return { updatedCount }
  },
})

// 批量為物件生成月度帳單
export const generateMonthlyBills = mutation({
  args: {
    propertyId: v.id("properties"),
    billMonth: v.string(), // "2026-02"
    dueDayOfMonth: v.number(), // 到期日（每月幾號）
    paymentAccount: v.string(), // 收款帳號
    paymentNote: v.optional(v.string()), // 繳費備註
  },
  handler: async (ctx, args) => {
    const { propertyId, billMonth, dueDayOfMonth, paymentAccount, paymentNote } = args

    // 取得物件的所有房間
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .collect()

    const createdBills = []
    const now = Date.now()

    // 計算下個月的到期日
    const [year, month] = billMonth.split('-').map(Number)
    const dueDate = new Date(year, month - 1, dueDayOfMonth).getTime()

    // 為每個有房客的房間生成帳單
    for (const room of rooms) {
      // 查找該房間的房客
      const activeTenants = await ctx.db
        .query("tenants")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect()

      // 過濾租約有效期內的房客
      const validTenants = activeTenants.filter(t =>
        t.leaseStartDate < now && t.leaseEndDate > now
      )

      for (const tenant of validTenants) {
        // 檢查是否已經有該月份的帳單
        const existingBill = await ctx.db
          .query("bills")
          .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
          .filter((q) => q.eq(q.field("billMonth"), billMonth))
          .first()

        if (!existingBill) {
          // 創建新帳單
          const billId = await ctx.db.insert("bills", {
            tenantId: tenant._id,
            roomId: room._id,
            propertyId,
            billMonth,
            dueDate,
            rentAmount: room.monthlyRent,
            managementFee: room.managementFee || 0,
            utilityFee: (room.waterFee || 0) + (room.electricityFee || 0) + (room.internetFee || 0),
            otherFee: 0,
            amount: room.monthlyRent + (room.managementFee || 0) + (room.waterFee || 0) + (room.electricityFee || 0) + (room.internetFee || 0),
            paymentAccount,
            paymentNote,
            paidAmount: 0,
            status: "unpaid",
            createdAt: now,
            updatedAt: now,
          })
          createdBills.push(billId)
        }
      }
    }

    return {
      created: createdBills.length,
      bills: createdBills,
    }
  },
})
