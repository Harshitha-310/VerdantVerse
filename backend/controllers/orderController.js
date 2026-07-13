const Order = require('../models/Order');
const Plant = require('../models/Plant');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, discountCode, discount } = req.body;

    let subtotal = 0;

    for (let item of items) {
      const plant = await Plant.findById(item.plant);

      if (!plant) {
        return res.status(404).json({ 
          message: `Plant ${item.plantName || item.plant} not found`
        });
      }

      if (plant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${plant.name}. Available: ${plant.stock}`
        });
      }

      // Update stock
      plant.stock -= item.quantity;
      await plant.save();

      subtotal += (item.price + ((item.selectedPlanter?.price) || 0)) * item.quantity;
    }

    const shippingCost = subtotal > 499 ? 0 : 50;
    const total = subtotal - (discount || 0) + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      discountCode,
      discount,
      subtotal,
      shippingCost,
      total,
      orderStatus: 'pending'
    });

    // Send email
    await sendOrderConfirmationEmail(req.user.email, order);

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.plant', 'name image');

    res.status(201).json(populatedOrder);

  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ message: 'Error creating order' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.plant', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.plant', 'name image category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only order owner or admin can view
    if (
      order.user._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({ message: 'Error updating order status' });
  }
};
