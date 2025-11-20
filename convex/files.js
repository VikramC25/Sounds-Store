import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get a single storage file URL.
 */
export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, { fileId }) => {
    return await ctx.storage.getUrl(fileId);
  },
});

/**
 * Get URLs for multiple snippet audio files.
 */
export const getMultipleFileUrls = query({
  args: { snippetIds: v.array(v.id("_storage")) },
  handler: async (ctx, { snippetIds }) => {
    return Promise.all(snippetIds.map((id) => ctx.storage.getUrl(id)));
  },
});
