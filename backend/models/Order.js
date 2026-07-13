const mongoose = require("mongoose");

/* ============================================================
   ORDER ITEM SCHEMA
============================================================ */
const orderItemSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  name: String, // plant name
  selectedPlanter: {
    name: String,
    price: Number,
  },
  selectedColor: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  isGift: {
    type: Boolean,
    default: false,
  },
});

/* ============================================================
   SHIPPING ADDRESS SCHEMA
============================================================ */
const addressSchema = new mongoose.Schema({
  name: String, // full name
  phone: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
  landmark: String,
});

/* ============================================================
   ORDER SCHEMA
============================================================ */
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // guest checkout supported
  },

  email: String, // for guest checkout

  items: [orderItemSchema],

  shippingAddress: addressSchema,

  /* -----------------------
     Payment & Order Status
  ------------------------*/
  paymentMethod: {
    type: String,
    enum: ["razorpay", "fake"],
    default: "fake",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },

  /* -----------------------
     Pricing
  ------------------------*/
  subtotal: Number,
  discount: Number,
  shippingCost: Number,
  totalAmount: Number,

  discountCode: String,
  notes: String,

  trackingNumber: String,
  estimatedDelivery: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/* ============================================================
   AUTO UPDATE updatedAt
============================================================ */
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* ============================================================
   AUTO GENERATE ORDER ID
============================================================ */
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `GL-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);