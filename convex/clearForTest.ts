import { mutation } from "./_generated/server";

/**
 * 清空所有 landlord 和 user 數據
 * 只用於開發測試
 */
export const clearLandlordsForTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 刪除所有 landlords
    const landlords = await ctx.db.query("landlords").collect();

    // 先保存對應的 userIds
    const userIds = new Set(landlords.map(l => l.userId.toString()));

    // 刪除所有 landlords
    for (const landlord of landlords) {
      await ctx.db.delete(landlord._id);
    }

    // 刪除所有 users（包括剛才創建的測試用 landlord users）
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }

    return {
      deletedLandlords: landlords.length,
      deletedUsers: users.length,
    };
  },
});
