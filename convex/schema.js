import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  packs: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),

    coverFileId: v.id("_storage"),       // image from Convex storage
    snippets: v.array(v.id("_storage")), // mp3s from Convex storage
    
    fullPackFileId: v.id("_storage"),    // <-- TXT file containing external ZIP URL

    tags: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  orders: defineTable({
    email: v.string(),
    packId: v.id("packs"),
    amount: v.number(),
    paypalOrderId: v.string(),
    paid: v.boolean(),
    createdAt: v.number()
  }),
});