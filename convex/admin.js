import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ------------------- GET PACK BY SLUG -------------------
export const getPackBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db.query("packs")
      .filter(q => q.eq(q.field("slug"), slug))
      .first();
  },
});

// (Your other mutations below)
export const getUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPack = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    coverFileId: v.id("_storage"),
    snippets: v.array(v.id("_storage")),
    fullPackFileId: v.id("_storage"),
    tags: v.array(v.string()),
    createdAt: v.number(),
    
    // 1. ADD THIS ARGUMENT
    adminSecret: v.string(),
  },
  handler: async (ctx, args) => {
    // 2. CHECK THE KEY (This runs on the server, safe from hackers)
    if (args.adminSecret !== process.env.ADMIN_SECRET) {
      throw new Error("⛔ ACCESS DENIED: Incorrect Admin Password");
    }

    // 3. REMOVE SECRET FROM DATA BEFORE SAVING
    const { adminSecret, ...packData } = args;
    return await ctx.db.insert("packs", packData);
  },
});
