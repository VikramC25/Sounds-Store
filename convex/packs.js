import { query } from "./_generated/server";
import { v } from "convex/values";

// Fetch pack by slug
export const getPackBySlug = query({
  args: { slug: v.string() },
  handler: async ({ db, storage }, { slug }) => {
    const pack = await db
      .query("packs")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();

    if (!pack) return null;

    const coverUrl = await storage.getUrl(pack.coverFileId);
    const snippetUrls = await Promise.all(
      pack.snippets.map((id) => storage.getUrl(id))
    );

    return {
      ...pack,
      coverUrl,
      snippetUrls,
    };
  },
});
