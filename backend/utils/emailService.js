const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmationEmail = async (userEmail, order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Green Leaf - Order Confirmation</h2>
          <p>Dear Customer,</p>
          <p>Thank you for your order! Here are your order details:</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order #${order.orderId}</h3>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${order.total}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Items Ordered:</h3>
            ${order.items
              .map(
                item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.plantName || ''}</strong> ${item.selectedColor ? `- ${item.selectedColor}` : ''}</p>
                <p>
                  Planter: ${item.selectedPlanter?.name || 'N/A'} | 
                  Qty: ${item.quantity} | 
                  Price: ₹${item.price}
                </p>
              </div>
            `
              )
              .join('')}
          </div>

          <div style="margin-top: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px;">
            <h3>Shipping Address:</h3>
            <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}</p>
            <p>${order.shippingAddress.country}</p>
          </div>

          <p style="margin-top: 20px;">We'll notify you when your order ships. Thank you for choosing Green Leaf!</p>

          <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Best regards,<br>The Green Leaf Team</p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', userEmail);

  } catch (error) {
    console.error('Error sending email:', error);
  }
};
