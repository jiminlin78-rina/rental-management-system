import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * 根據物管姓名查找 landlordId
 */
export const findLandlordByManagerName = query({
  args: {
    managerName: v.string(),
  },
  handler: async (ctx, args) => {
    // 查找該姓名的 user
    const users = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("name"), args.managerName))
      .collect();

    if (users.length === 0) {
      return null;
    }

    // 找到第一個 role=landlord 的用戶
    const landlordUser = users.find(u => (u.role as any) === "landlord");

    if (!landlordUser) {
      return null;
    }

    // 查找對應的 landlord
    const landlord = await ctx.db
      .query("landlords")
      .filter(q => q.eq(q.field("userId"), landlordUser._id))
      .first();

    if (!landlord) {
      return null;
    }

    return {
      landlordId: landlord._id,
      userName: landlordUser.name,
      userId: landlordUser._id,
    };
  },
});
