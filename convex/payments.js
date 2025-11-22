import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

// CREATE ORDER IN DB
export const createOrder = mutation({
  args: {
    email: v.string(),
    packId: v.id("packs"),
    amount: v.number(),
  },
  handler: async (ctx, { email, packId, amount }) => {
    return ctx.db.insert("orders", {
      email,
      packId,
      amount,
      paid: false,
      razorpayOrderId: "",
      createdAt: Date.now(),
    });
  },
});

// ATTACH Razorpay ORDER ID
export const attachRzp = mutation({
  args: {
    orderId: v.id("orders"),
    razorpayOrderId: v.string(),
  },
  handler: async (ctx, { orderId, razorpayOrderId }) => {
    await ctx.db.patch(orderId, { razorpayOrderId });
  },
});

// SERVER-SIDE Razorpay ORDER CREATION (SECRET KEY SAFE)
export const createRazorpayOrder = action({
  args: {
    amount: v.number(),
    receipt: v.string(),
  },
  handler: async (ctx, { amount, receipt }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // FIX: Use btoa() instead of Buffer.from()
    const authHeader = "Basic " + btoa(`${keyId}:${keySecret}`);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise/cents
        currency: "INR",
        receipt,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Razorpay Error: ${errorText}`);
    }

    return await res.json();
  },
});

// MARK AS PAID
export const markPaid = mutation({
  args: {
    orderId: v.id("orders"),
    paymentId: v.string(),
  },
  handler: async (ctx, { orderId, paymentId }) => {
    await ctx.db.patch(orderId, {
      paid: true,
      paymentId: paymentId, // Save the payment ID here
    });

    const order = await ctx.db.get(orderId);
    const pack = await ctx.db.get(order.packId);

    // GENERATE THE SIGNED URL HERE
    // This ensures only the person who just paid gets the link
    const downloadUrl = await ctx.storage.getUrl(pack.fullPackFileId);

    return {
      success: true,
      downloadUrl: downloadUrl 
    };
  },
});

// 1. CREATE MULTIPLE ORDERS (One for each item in cart)
export const createCartEntries = mutation({
  args: {
    email: v.string(),
    items: v.array(v.object({ packId: v.id("packs"), amount: v.number() })),
  },
  handler: async (ctx, { email, items }) => {
    const orderIds = [];
    for (const item of items) {
      const id = await ctx.db.insert("orders", {
        email,
        packId: item.packId,
        amount: item.amount,
        paid: false,
        razorpayOrderId: "", // Will be filled next
        createdAt: Date.now(),
      });
      orderIds.push(id);
    }
    return orderIds;
  },
});

// 2. ATTACH RAZORPAY ID TO ALL ORDERS
export const attachCartRzp = mutation({
  args: {
    orderIds: v.array(v.id("orders")),
    razorpayOrderId: v.string(),
  },
  handler: async (ctx, { orderIds, razorpayOrderId }) => {
    for (const id of orderIds) {
      await ctx.db.patch(id, { razorpayOrderId });
    }
  },
});

// 3. MARK ALL PAID & RETURN SECURE LINKS
export const markCartPaid = mutation({
  args: {
    razorpayOrderId: v.string(),
    paymentId: v.string(),
  },
  handler: async (ctx, { razorpayOrderId, paymentId }) => {
    // Find all orders belonging to this transaction
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("razorpayOrderId"), razorpayOrderId))
      .collect();

    const downloadLinks = [];

    for (const order of orders) {
      // Mark as paid
      await ctx.db.patch(order._id, { paid: true, paymentId });
      
      // Get the secure URL
      const pack = await ctx.db.get(order.packId);
      const url = await ctx.storage.getUrl(pack.fullPackFileId);
      downloadLinks.push({ title: pack.title, url });
    }

    return downloadLinks;
  },
});