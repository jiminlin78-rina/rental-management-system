import { mutation } from "./_generated/server";

/**
 * 清除所有 Ragic 物件和日誌
 */
export const clearRagicProperties = mutation({
  args: {},
  handler: async (ctx) => {
    // 刪除所有有 ragicRecordId 的 properties
    const allProperties = await ctx.db.query("properties").collect();
    const ragicProperties = allProperties.filter(p => p.ragicRecordId);

    for (const prop of ragicProperties) {
      await ctx.db.delete(prop._id);
    }

    // 刪除同步日誌
    const syncLogs = await ctx.db.query("ragicSyncLogs").collect();
    for (const log of syncLogs) {
      await ctx.db.delete(log._id);
    }

    return {
      deletedProperties: ragicProperties.length,
      deletedLogs: syncLogs.length,
    };
  },
});
