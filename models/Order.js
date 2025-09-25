import mongoose from "mongoose";

// Subdocument schema for order items
const orderItem = {
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  sku: String,
  qty: Number,
  unitPrice: Number,
  total: Number
};

// Subdocument schema for payment details
const paymentSchema = {
  provider: String,   // 'stripe'
  providerPaymentId: String,
  amount: Number,
  currency: String,
  status: String,
  raw: mongoose.Schema.Types.Mixed
};

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  items: [orderItem],
  subtotal: Number,
  shipping: Number,
  taxes: Number,
  total: Number,
  currency: { type: String, default: 'USD' },
  shippingAddress: mongoose.Schema.Types.Mixed,
  billingAddress: mongoose.Schema.Types.Mixed,
  status: { type: String, default: "pending", index: true }, // pending, paid, shipping, completed, refunded
  payment: paymentSchema,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

orderSchema.index({ user: 1, status: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
