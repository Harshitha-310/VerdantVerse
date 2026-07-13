const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/auth");

const {
  validateOrder,
  validateOrderStatus,
  handleValidationErrors,
  validateObjectId,
  sanitizeInput
} = require("../middleware/validation");

const Plant = require("../models/Plant");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

/* ============================================================
   1️⃣  CREATE ORDER (YOUR ORIGINAL)
============================================================ */
router.post(
  "/",
  protect,
  sanitizeInput,
  validateOrder,
  handleValidationErrors,
  createOrder
);

/* ============================================================
   2️⃣ GET LOGGED-IN USER ORDERS
============================================================ */
router.get("/my-orders", protect, getUserOrders);

/* ============================================================
   3️⃣ GET SINGLE ORDER
============================================================ */
router.get("/:id", protect, validateObjectId, getOrder);

/* ============================================================
   4️⃣ UPDATE ORDER STATUS (ADMIN ONLY)
============================================================ */
router.put(
  "/:id/status",
  protect,
  admin,
  sanitizeInput,
  validateOrderStatus,
  handleValidationErrors,
  updateOrderStatus
);

/* ============================================================
   5️⃣  FAKE PAYMENT ORDER CONFIRMATION (MAIN LOGIC)
   ✔ Saves order to DB
   ✔ Saves shipping address
   ✔ Reduces stock safely
   ✔ Sends confirmation email
============================================================ */
router.post("/confirm", async (req, res) => {
  console.log("🔥 /confirm HIT");
console.log("Request Body:", req.body);
  const { cart, email, shippingAddress, userId } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty"
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      message: "Shipping address is required"
    });
  }

  try {
    /* ---------------------------------------------
       1️⃣ SAFE STOCK REDUCTION (Prevents negatives)
    --------------------------------------------- */
    for (const item of cart) {
      const updated = await Plant.findOneAndUpdate(
        { _id: item._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`
        });
      }
    }

    /* ---------------------------------------------
       2️⃣ SAVE ORDER TO DATABASE
    --------------------------------------------- */
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const savedOrder = await Order.create({
      user: userId || null,
      email,
      items: cart.map((item) => ({
        plant: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing",
      createdAt: new Date()
    });

    /* ---------------------------------------------
       3️⃣ SEND EMAIL CONFIRMATION
    --------------------------------------------- */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemList = cart
      .map(
        (i) =>
          `<li>${i.name} × ${i.quantity} — ₹${i.price * i.quantity}</li>`
      )
      .join("");

    const mailOptions = {
      from: `Green Leaf 🌿 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Green Leaf Order is Confirmed!",
      html: `
        <h2>Thank you for your order 🌿</h2>
        <p>Your payment was processed successfully (Fake Payment Mode).</p>

        <h3>Order Items:</h3>
        <ul>${itemList}</ul>
        <h3>Total Amount: ₹${totalAmount}</h3>

        <h3>Shipping Address:</h3>
        <p>
          ${shippingAddress.name}<br>
          ${shippingAddress.address}<br>
          ${shippingAddress.city}, ${shippingAddress.state}<br>
          PIN: ${shippingAddress.pincode}<br>
          Phone: ${shippingAddress.phone}<br>
          Landmark: ${shippingAddress.landmark || "N/A"}
        </p>

        <p>Order ID: <strong>${savedOrder._id}</strong></p>
        <p>Your plants will be shipped soon! 🌱</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Order confirmed, stock updated & email sent.",
      order: savedOrder
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    return res.status(500).json({
      success: false,
      message: "Order confirmation failed.",
      error: error.message
    });
  }
});

module.exports = router;