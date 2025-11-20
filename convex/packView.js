import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Optimized single query:
 * - Pack data
 * - Cover URL
 * - Snippet URLs
 * - TXT URL
 */
export const getPackWithUrls = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    // 1) Get pack from DB
    const pack = await ctx.db
      .query("packs")
      .filter(q => q.eq(q.field("slug"), slug))
      .first();

    if (!pack) return null;

    // 2) Generate URLs
    const coverUrl = await ctx.storage.getUrl(pack.coverFileId);

    const snippetUrls = await Promise.all(
      pack.snippets.map(id => ctx.storage.getUrl(id))
    );

    const txtUrl = await ctx.storage.getUrl(pack.fullPackFileId);

    return {
      ...pack,
      coverUrl,
      snippetUrls,
      txtUrl,
    };
  },
});
