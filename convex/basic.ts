import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * 根據物管姓名查找或創建對應的 landlord
 */
export const findOrCreateLandlord = mutation({
  args: {
    managerName: v.string(),
  },
  handler: async (ctx, args) => {
    // 暫時直接創建（實際生產應該先檢查是否已存在）
    // 創建 user 記錄
    const user = await ctx.db.insert("users", {
      clerkId: `manager_${args.managerName.replace(/\s/g, '_')}`,
      email: `${args.managerName.replace(/\s/g, '_')}@ragic.local`,
      name: args.managerName,
      role: "landlord",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // 創建 landlord 記錄
    const landlord = await ctx.db.insert("landlords", {
      userId: user,
      phone: "0912345678",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return landlord;
  },
});
