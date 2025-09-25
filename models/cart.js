const cartItem = {
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantSku: String,
  qty: { type: Number, default: 1 },
  priceAtAdd: Number
};

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  items: [cartItem],
  updatedAt: Date
}, { timestamps: true });


export default mongoose.model("Cart", cartSchema);
