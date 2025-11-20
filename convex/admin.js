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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("packs", args);
    const pack = await ctx.db.get(id);

    return { slug: pack.slug };   // <-- RETURN THE SLUG
  },
});

