const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    reference: "Product",
  },

  name: String,

  count: Number,

  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema],

    transaction_id: {},

    amount: {
      type: String,
    },

    status: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"],
    },

    address: String,

    updated: Date,

    user: {
      type: ObjectId,
      reference: "User",
    },
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", productCartSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = { ProductCart, Order };
