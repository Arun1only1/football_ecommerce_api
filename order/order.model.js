import mongoose from "mongoose";

// set rule
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "users",
  },

  sellerId: { type: mongoose.ObjectId, required: true, ref: "users" },

  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },

  subTotal: { type: Number, required: true, min: 0 },

  productId: { type: mongoose.ObjectId, required: true, ref: "products" },

  paymentStatus: {
    type: String,
    required: true,
    enum: [
      "Completed",
      "Initiated",
      "Pending",
      "Expired",
      "Refunded",
      "User canceled",
      "Partially refunded",
    ],
  },

  pidx: {
    type: String,
    required: true,
    trim: true,
  },
});

// create collection
const Order = mongoose.model("Order", orderSchema);
export default Order;
