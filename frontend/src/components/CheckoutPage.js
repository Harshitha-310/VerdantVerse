import React, { Component } from 'react';
import './CheckoutPage.css';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailUpdates: true,

      country: 'India',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      pinCode: '',
      phone: '',
      saveInfo: true,

      shippingMethod: '',
      paymentMethod: 'razorpay',
      sameBillingAddress: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
    this.handleBackToCart = this.handleBackToCart.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handlePlaceOrder() {
  if (!this.validateForm()) return;

  alert("Processing payment...");

  // Build shipping address from your state fields
  const shippingAddress = {
    firstName: this.state.firstName,
    lastName: this.state.lastName,
    email: this.state.email,
    phone: this.state.phone,
    address: this.state.address,
    city: this.state.city,
    state: this.state.state,
    pinCode: this.state.pinCode,
    country: this.state.country
  };

  // Billing = Same as shipping or separate
  const billingAddress = this.state.sameBillingAddress
    ? shippingAddress
    : {
        firstName: this.state.billingFirstName,
        lastName: this.state.billingLastName,
        address: this.state.billingAddress,
        city: this.state.billingCity,
        state: this.state.billingState,
        pinCode: this.state.billingPinCode,
        country: "India"
      };

  // Build final payload to send to backend
  const orderPayload = {
    cart: this.props.cart,
    email: this.state.email,
    shippingAddress,
    billingAddress,
    subtotal: this.props.cartTotal,
    total: this.props.cartTotal,
    discount: 0,
    shippingCost: 0,
    paymentMethod: "fake",
    paymentStatus: "completed"
  };

  console.log("🔥 Sending Order to backend:", orderPayload);

  const res = await fetch("http://localhost:5001/api/orders/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload)
  });

  const data = await res.json();

  if (data.success) {
    alert("🎉 Payment successful!\nYour order has been placed.");

    if (this.props.onPaymentSuccess) {
      this.props.onPaymentSuccess();
    }

    window.location.href = "/#success";
  } else {
    alert("Payment processed, but stock update or email failed.");
  }
}

  handleBackToCart() {
    this.props.onBackToCart();
  }

  validateForm() {
    const { firstName, lastName, address, city, pinCode, phone, email } = this.state;

    if (!firstName || !lastName || !address || !city || !pinCode || !phone || !email) {
      alert('Please fill all fields');
      return false;
    }

    if (pinCode.length !== 6) {
      alert('PIN code must be 6 digits');
      return false;
    }

    if (phone.length !== 10) {
      alert('Phone must be 10 digits');
      return false;
    }

    return true;
  }

  get cartTotal() {
    return this.props.cartTotal || 1999;
  }

  render() {
    const { cart } = this.props;
    const { email, emailUpdates, firstName, lastName, address, city, state,
      pinCode, phone, saveInfo, paymentMethod, sameBillingAddress } = this.state;

    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <nav className="checkout-nav">
            <button className="back-btn" onClick={this.handleBackToCart}>
              ← Back to Cart
            </button>
            <h1 className="logo">Green Leaf</h1>
            <div className="checkout-title">CHECKOUT</div>
          </nav>
        </header>

        <div className="checkout-container">

          {/* LEFT SIDE FORM */}
          <div className="checkout-form-section">

            {/* CONTACT */}
            <section className="checkout-section">
              <h2 className="section-title">Contact</h2>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={email}
                       onChange={this.handleInputChange} required />
              </div>
              <label className="checkbox-label">
                <input type="checkbox" name="emailUpdates"
                       checked={emailUpdates} onChange={this.handleInputChange} />
                <span className="checkmark"></span>
                Email me with news and offers
              </label>
            </section>

            {/* DELIVERY */}
            <section className="checkout-section">
              <h2 className="section-title">Delivery</h2>

              <div className="form-group">
                <label>Country/Region</label>
                <select name="country" value={this.state.country} onChange={this.handleInputChange}>
                  <option value="India">India</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input type="text" name="firstName" value={firstName}
                         onChange={this.handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Last name</label>
                  <input type="text" name="lastName" value={lastName}
                         onChange={this.handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={address}
                       onChange={this.handleInputChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={city}
                         onChange={this.handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <select name="state" value={state} onChange={this.handleInputChange}>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>PIN code</label>
                  <input type="text" name="pinCode" maxLength="6" value={pinCode}
                         onChange={this.handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" maxLength="10"
                       value={phone} onChange={this.handleInputChange} required />
              </div>

              <label className="checkbox-label">
                <input type="checkbox" name="saveInfo"
                       checked={saveInfo} onChange={this.handleInputChange} />
                <span className="checkmark"></span>
                Save this information for next time
              </label>
            </section>

            {/* SHIPPING METHOD */}
            <section className="checkout-section">
              <h2 className="section-title">Shipping Method</h2>
              <div className="shipping-notice">Enter your address to view shipping methods.</div>
            </section>

            {/* PAYMENT */}
            <section className="checkout-section">
              <h2 className="section-title">Payment</h2>

              <div className="payment-method">
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="razorpay"
                         checked={paymentMethod === 'razorpay'}
                         onChange={this.handleInputChange} />
                  <span className="radio-checkmark"></span>
                  Razorpay Secure (UPI, Cards, Wallets)
                </label>
                <div className="payment-description">
                  You will be redirected to Razorpay to complete payment.
                </div>
              </div>

              <div className="billing-address">
                <label className="checkbox-label">
                  <input type="checkbox" name="sameBillingAddress"
                         checked={sameBillingAddress}
                         onChange={this.handleInputChange} />
                  <span className="checkmark"></span>
                  Same as shipping address
                </label>
              </div>

              <button className="place-order-btn" onClick={this.handlePlaceOrder}>
                Pay now – ₹{this.cartTotal}
              </button>
            </section>
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="cart-items-preview">
                {cart?.map(item => (
                  <div key={item.cartId} className="cart-preview-item">
                    <img src={`http://localhost:5001${item.image}`} className="preview-image" />
                    <div className="preview-details">
                      <h4>{item.name}</h4>
                      <p>{item.selectedPlanter?.name} • {item.selectedColor}</p>
                      <div className="preview-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="preview-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>₹{this.cartTotal}</span>
                </div>

                <div className="total-line">
                  <span>Shipping</span>
                  <span>Enter address</span>
                </div>

                <div className="grand-total total-line">
                  <span>Total</span>
                  <span>₹{this.cartTotal}</span>
                </div>
              </div>

              <div className="trust-badges">
                <div className="trust-title">10 Million+ customers trust us</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default CheckoutPage;