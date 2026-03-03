import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * 直接從 Ragic 數據創建/更新物件
 * 此 mutation 接受處理後的英文鍵名數據
 */
export const syncRagicPropertyDirect = mutation({
  args: {
    ragicRecordId: v.string(),
    name: v.string(),
    address: v.string(),
    monthlyRent: v.number(),
    managementFee: v.number(),
    status: v.string(),
    propertyManager: v.optional(v.string()),
    deposit: v.number(),
    leaseStartDate: v.optional(v.number()),
    leaseEndDate: v.optional(v.number()),
    landlordId: v.id("landlords"),
  },
  handler: async (ctx, args) => {
    // 檢查是否已存在
    const existing = await ctx.db
      .query("properties")
      .withIndex("by_ragic", (q) => q.eq("ragicRecordId", args.ragicRecordId))
      .first();

    let propertyId;

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        address: args.address,
        monthlyRent: args.monthlyRent,
        managementFee: args.managementFee,
        status: args.status,
        propertyManager: args.propertyManager,
        deposit: args.deposit,
        leaseStartDate: args.leaseStartDate,
        leaseEndDate: args.leaseEndDate,
        updatedAt: Date.now(),
      });
      propertyId = existing._id;
    } else {
      propertyId = await ctx.db.insert("properties", {
        name: args.name,
        address: args.address,
        monthlyRent: args.monthlyRent,
        managementFee: args.managementFee,
        status: args.status,
        propertyManager: args.propertyManager,
        deposit: args.deposit,
        leaseStartDate: args.leaseStartDate,
        leaseEndDate: args.leaseEndDate,
        ragicRecordId: args.ragicRecordId,
        landlordId: args.landlordId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // 記錄同步日誌
    await ctx.db.insert("ragicSyncLogs", {
      entityType: "property",
      ragicRecordId: args.ragicRecordId,
      convexId: propertyId.toString(),
      syncAt: Date.now(),
      status: "success",
    });

    return propertyId;
  },
});

/**
 * 批量同步 Ragic 物件（使用英文鍵名的記錄）
 */
export const syncRagicPropertiesBatch = mutation({
  args: {
    properties: v.array(
      v.object({
        ragicRecordId: v.string(),
        name: v.string(),
        address: v.string(),
        monthlyRent: v.number(),
        managementFee: v.number(),
        status: v.string(),
        propertyManager: v.optional(v.string()),
        deposit: v.number(),
        leaseStartDate: v.optional(v.number()),
        leaseEndDate: v.optional(v.number()),
      })
    ),
    landlordId: v.id("landlords"),
  },
  handler: async (ctx, args) => {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const prop of args.properties) {
      try {
        await ctx.db.insert("ragicSyncLogs", {
          entityType: "property",
          ragicRecordId: prop.ragicRecordId,
          convexId: "",
          syncAt: Date.now(),
          status: "success",
        });

        // 直接插入（覆蓋 ragicRecordId 的邏輯）
        const existing = await ctx.db
          .query("properties")
          .withIndex("by_ragic", (q) => q.eq("ragicRecordId", prop.ragicRecordId))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, {
            ...prop,
            landlordId: args.landlordId,
            updatedAt: Date.now(),
          });
        } else {
          await ctx.db.insert("properties", {
            ...prop,
            landlordId: args.landlordId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${prop.ragicRecordId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return results;
  },
});
