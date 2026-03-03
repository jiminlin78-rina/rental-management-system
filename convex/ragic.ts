// Ragic → Convex 同步邏輯

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Ragic 欄位映射到 Convex properties 表
 */
function mapRagicToConvexProperty(ragicRecord: any) {
  // 解析起租日期
  let leaseStartDate = null;
  if (ragicRecord['起租']) {
    const parts = String(ragicRecord['起租']).split('-');
    if (parts.length === 3 && parts.every(p => p)) {
      leaseStartDate = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`).getTime();
    }
  }

  // 解析房東租期
  let leaseEndDate = null;
  if (ragicRecord['房東租期']) {
    leaseEndDate = new Date(ragicRecord['房東租期']).getTime();
  }

  return {
    name: ragicRecord['館名'] || '未命名物件',
    address: ragicRecord['館名'] || '',
    monthlyRent: parseInt(ragicRecord['租金'] || '0'),
    managementFee: parseInt(ragicRecord['管理費'] || '0'),
    status: ragicRecord['狀態'] || 'unknown',
    propertyManager: ragicRecord['物管'] || null,
    deposit: parseInt(ragicRecord['押金'] || '0'),
    leaseStartDate,
    leaseEndDate,
    ragicRecordId: ragicRecord['_ragicId']?.toString(),
  };
}

/**
 * 同步單個物件
 */
export const syncProperty = mutation({
  args: {
    ragicRecord: v.any(),
    landlordId: v.id("landlords"),
  },
  handler: async (ctx, args) => {
    const propertyData = mapRagicToConvexProperty(args.ragicRecord);

    const existing = await ctx.db
      .query("properties")
      .withIndex("by_ragic", (q) => q.eq("ragicRecordId", propertyData.ragicRecordId))
      .first();

    let propertyId;

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...propertyData,
        updatedAt: Date.now(),
      });
      propertyId = existing._id;
    } else {
      propertyId = await ctx.db.insert("properties", {
        ...propertyData,
        landlordId: args.landlordId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.insert("ragicSyncLogs", {
      entityType: "property",
      ragicRecordId: propertyData.ragicRecordId,
      convexId: propertyId.toString(),
      syncAt: Date.now(),
      status: "success",
    });

    return propertyId;
  },
});

/**
 * 批量同步物件
 */
export const syncProperties = mutation({
  args: {
    ragicRecords: v.array(v.any()),
    landlordId: v.id("landlords"),
  },
  handler: async (ctx, args) => {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const record of args.ragicRecords) {
      try {
        await ctx.runMutation(api.ragic.syncProperty, {
          ragicRecord: record,
          landlordId: args.landlordId,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Record ${record._ragicId}: ${error instanceof Error ? error.message : String(error)}`);

        await ctx.db.insert("ragicSyncLogs", {
          entityType: "property",
          ragicRecordId: record._ragicId?.toString(),
          convexId: "",
          syncAt: Date.now(),
          status: "failed",
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  },
});

/**
 * 獲取同步歷史
 */
export const getSyncHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ragicSyncLogs")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

/**
 * 獲取同步統計
 */
export const getSyncStats = query({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("ragicSyncLogs").collect();

    return {
      total: allLogs.length,
      success: allLogs.filter(log => log.status === 'success').length,
      failed: allLogs.filter(log => log.status === 'failed').length,
      lastSyncAt: allLogs.length > 0 ? allLogs[0].syncAt : null,
    };
  },
});
