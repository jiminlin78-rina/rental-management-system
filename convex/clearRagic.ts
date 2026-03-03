import { mutation } from "./_generated/server";

/**
 * 清除所有 Ragic 同步的物件
 * 危險操作！僅在開發環境使用
 */
export const clearRagicProperties = mutation({
  args: {},
  handler: async (ctx) => {
    const allProperties = await ctx.db.query("properties").collect();

    // 只刪除有 ragicRecordId 的物件
    const ragicProperties = allProperties.filter(p => p.ragicRecordId);

    for (const prop of ragicProperties) {
      await ctx.db.delete(prop._id);
    }

    // 同時刪除相關的同步日誌
    const syncLogs = await ctx.db.query("ragicSyncLogs").collect();
    for (const log of syncLogs) {
      await ctx.db.delete(log._id);
    }

    return {
      deleted: ragicProperties.length,
      logsDeleted: syncLogs.length
    };
  },
});
