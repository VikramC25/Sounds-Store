import { query } from "./_generated/server";
import { v } from "convex/values";

// Fetch pack by slug
export const getPackBySlug = query({
  args: { slug: v.string() },
  handler: async ({ db, storage }, { slug }) => {
    // OPTIMIZATION: Use the index you defined in schema.js
    // This is faster than .filter()
    const pack = await db
      .query("packs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!pack) return null;

    // ---------------------------------------------------------
    // SECURITY FIX: Strip the secret file ID
    // We separate 'fullPackFileId' from the rest of the data
    // ---------------------------------------------------------
    const { fullPackFileId, ...safePack } = pack;

    // Generate public URLs for cover and snippets
    const coverUrl = await storage.getUrl(pack.coverFileId);
    const snippetUrls = await Promise.all(
      pack.snippets.map((id) => storage.getUrl(id))
    );

    return {
      ...safePack, // This now contains everything EXCEPT the secret ID
      coverUrl,
      snippetUrls,
    };
  },
});

// GET ALL PACKS
export const getAllPacks = query({
  handler: async ({ db, storage }) => {
    const packs = await db.query("packs").order("desc").collect();

    // Get signed URLs for all cover images
    const packsWithUrl = await Promise.all(
      packs.map(async (pack) => {
        const coverUrl = await storage.getUrl(pack.coverFileId);
        // Security: We DO NOT return the fullPackFileId here
        return { 
          _id: pack._id,
          title: pack.title,
          slug: pack.slug,
          price: pack.price,
          coverUrl 
        };
      })
    );

    return packsWithUrl;
  },
});