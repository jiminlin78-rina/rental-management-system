import { v } from "convex/values"
import { mutation } from "./_generated/server"

// 初始化測試資料（高雄物件）
export const seedKaohsiungData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. 建立房東用戶（測試用）
    const landlordUserId = await ctx.db.insert("users", {
      clerkId: "test_landlord_001",
      email: "landlord@example.com",
      name: "王先生",
      role: "landlord",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 2. 建立房東資料
    const landlordId = await ctx.db.insert("landlords", {
      userId: landlordUserId,
      phone: "0912345678",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 3. 建立高雄物件
    const property1 = await ctx.db.insert("properties", {
      name: "高雄左營區 A 棟",
      address: "高雄市左營區博愛二路 123 號",
      landlordId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const property2 = await ctx.db.insert("properties", {
      name: "高雄鳳山區 B 棟",
      address: "高雄市鳳山區光大路 456 號",
      landlordId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const property3 = await ctx.db.insert("properties", {
      name: "高雄三民區 C 棟",
      address: "高雄市三民區建國一路 789 號",
      landlordId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 4. 建立房間
    // 左營區 A 棟 - 整層
    const room1 = await ctx.db.insert("rooms", {
      propertyId: property1,
      type: "entire_floor",
      floor: "1F",
      monthlyRent: 18000,
      managementFee: 1500,
      waterFee: 300,
      electricityFee: 500,
      internetFee: 200,
      description: "整層公寓，兩房兩廳，附冷氣傢俱",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const room2 = await ctx.db.insert("rooms", {
      propertyId: property1,
      type: "entire_floor",
      floor: "2F",
      monthlyRent: 18500,
      managementFee: 1500,
      waterFee: 300,
      electricityFee: 500,
      internetFee: 200,
      description: "整層公寓，兩房一廳，附陽台",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 鳳山區 B 棟 - 分租
    const room3 = await ctx.db.insert("rooms", {
      propertyId: property2,
      type: "shared",
      floor: "3F",
      roomNumber: "301",
      monthlyRent: 6500,
      managementFee: 500,
      waterFee: 200,
      electricityFee: 300,
      internetFee: 100,
      description: "雅房，共用客廳廚房",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const room4 = await ctx.db.insert("rooms", {
      propertyId: property2,
      type: "shared",
      floor: "3F",
      roomNumber: "302",
      monthlyRent: 7000,
      managementFee: 500,
      waterFee: 200,
      electricityFee: 300,
      internetFee: 100,
      description: "雅房，附小冷氣",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const room5 = await ctx.db.insert("rooms", {
      propertyId: property2,
      type: "shared",
      floor: "3F",
      roomNumber: "303",
      monthlyRent: 6800,
      managementFee: 500,
      waterFee: 200,
      electricityFee: 300,
      internetFee: 100,
      description: "雅房，近捷運站",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 三民區 C 棟 - 分租（更多房間）
    for (let i = 1; i <= 6; i++) {
      const floor = Math.ceil(i / 2)
      await ctx.db.insert("rooms", {
        propertyId: property3,
        type: "shared",
        floor: `${floor}F`,
        roomNumber: `${i}01`,
        monthlyRent: 5500,
        managementFee: 400,
        waterFee: 200,
        electricityFee: 250,
        internetFee: 100,
        description: i <= 2 ? "雅房，近商圈" : "雅房，安靜",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    // 5. 建立測試房客和帳單
    const tenantUserId = await ctx.db.insert("users", {
      clerkId: "test_tenant_001",
      email: "tenant@example.com",
      name: "張小美",
      role: "tenant",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const tenantId = await ctx.db.insert("tenants", {
      userId: tenantUserId,
      phone: "0987654321",
      roomId: room3,
      leaseStartDate: Date.now(),
      leaseEndDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 2026-02 帳單（待繳）
    const now = Date.now()
    const nextMonth = new Date(now + 35 * 24 * 60 * 60 * 1000) // 35 天後到期
    await ctx.db.insert("bills", {
      tenantId,
      roomId: room3,
      propertyId: property2,
      billMonth: "2026-02",
      dueDate: nextMonth.getTime(),
      amount: 7500,
      rentAmount: 6500,
      managementFee: 500,
      utilityFee: 500,
      otherFee: 0,
      paidAmount: 0,
      status: "unpaid",
      paymentAccount: "國泰世華 (822) 123-456-789",
      paymentNote: "匯款請備註「姓名 + 房號」",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 2026-01 帳單（已繳）
    const lastMonth = new Date(now)
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    await ctx.db.insert("bills", {
      tenantId,
      roomId: room3,
      propertyId: property2,
      billMonth: "2026-01",
      dueDate: lastMonth.getTime(),
      amount: 7500,
      rentAmount: 6500,
      managementFee: 500,
      utilityFee: 500,
      otherFee: 0,
      paidAmount: 7500,
      status: "paid",
      paymentAccount: "國泰世華 (822) 123-456-789",
      paymentNote: "匯款請備註「姓名 + 房號」",
      paidAt: lastMonth.getTime(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // 2025-12 帳單（已繳）
    const twoMonthsAgo = new Date(now)
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    await ctx.db.insert("bills", {
      tenantId,
      roomId: room3,
      propertyId: property2,
      billMonth: "2025-12",
      dueDate: twoMonthsAgo.getTime(),
      amount: 7500,
      rentAmount: 6500,
      managementFee: 500,
      utilityFee: 500,
      otherFee: 0,
      paidAmount: 7500,
      status: "paid",
      paymentAccount: "國泰世華 (822) 123-456-789",
      paymentNote: "匯款請備註「姓名 + 房號」",
      paidAt: twoMonthsAgo.getTime(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return {
      success: true,
      landlordUserId,
      landlordId,
      properties: 3,
      rooms: 11,
      tests: { tenantId, bills: 3 },
    }
  },
})

// 清空測試資料（謹慎使用！）
export const clearTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // 刪除所有測試數據
    const bills = await ctx.db.query("bills").collect()
    for (const bill of bills) {
      await ctx.db.delete(bill._id)
    }

    const tenants = await ctx.db.query("tenants").collect()
    for (const tenant of tenants) {
      await ctx.db.delete(tenant._id)
    }

    const rooms = await ctx.db.query("rooms").collect()
    for (const room of rooms) {
      await ctx.db.delete(room._id)
    }

    const properties = await ctx.db.query("properties").collect()
    for (const property of properties) {
      await ctx.db.delete(property._id)
    }

    const landlords = await ctx.db.query("landlords").collect()
    for (const landlord of landlords) {
      await ctx.db.delete(landlord._id)
    }

    // 只刪除測試用戶（clerkId 以 test_ 開頭的）
    const users = await ctx.db.query("users").collect()
    for (const user of users) {
      if (user.clerkId.startsWith("test_")) {
        await ctx.db.delete(user._id)
      }
    }

    return {
      success: true,
      deletedBills: bills.length,
      deletedTenants: tenants.length,
      deletedRooms: rooms.length,
      deletedProperties: properties.length,
      deletedLandlords: landlords.length,
      deletedTestUsers: users.filter(u => u.clerkId.startsWith("test_")).length,
    }
  },
})
