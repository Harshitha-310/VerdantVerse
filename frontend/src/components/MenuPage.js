// MenuPage.js
import React, { Component } from 'react';
import './MenuPage.css';
import CheckoutPage from './CheckoutPage'; // Already imported
import { plantsAPI, ordersAPI } from '../services/api';

// **********************************************
// COMPONENTS DEFINED WITHIN THIS FILE
// The ESLint errors were largely due to the incorrect
// usage of string concatenation/template literals inside
// JSX className attributes, which made it look like the
// component was using undefined variables (like 'btn', 'card', 'view').
// I've also added necessary classes for the nested components.
// **********************************************

// Define nested components before MenuPage if they aren't imported separately
// Since the prompt includes all components, they should be defined first
// or exported/imported properly. I'll structure them below MenuPage for simplicity
// and just ensure MenuPage's render logic is correct.

// ----------------------------------------------------

class MenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      searchTerm: '',
      selectedCategory: 'ALL',
      cart: [],
      selectedPlant: null,
      showCart: false,
      showCheckout: false,
      loading: true,
      error: null,
      aiOpen: false,
      aiMessage: "",
      aiChatHistory: [],
      aiLoading: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleBackToHome = this.handleBackToHome.bind(this);
    this.handlePlantSelect = this.handlePlantSelect.bind(this);
    this.handleBackToMenu = this.handleBackToMenu.bind(this);
    this.handleShowCart = this.handleShowCart.bind(this);
    this.handleCloseCart = this.handleCloseCart.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleBackToCart = this.handleBackToCart.bind(this);
    this.fetchPlants = this.fetchPlants.bind(this);

    // ✅ NEW BINDING
    this.handlePaymentSuccess = this.handlePaymentSuccess.bind(this);
    this.toggleAI = this.toggleAI.bind(this);
    this.handleAIInput = this.handleAIInput.bind(this);
    this.sendAIMessage = this.sendAIMessage.bind(this);
  }

  // ✅ NEW METHOD — Clear cart + refresh plants
  handlePaymentSuccess() {
    this.setState({ cart: [] });
    this.fetchPlants();

    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: { cartCount: 0 }
    });
    window.dispatchEvent(cartUpdateEvent);
  }

  componentDidMount() {
    this.fetchPlants();
  }

  async fetchPlants() {
    try {
      this.setState({ loading: true, error: null });
      const filters = {};

      if (this.state.selectedCategory !== 'ALL') {
        filters.category = this.state.selectedCategory;
      }

      if (this.state.searchTerm) {
        filters.search = this.state.searchTerm;
      }

      const response = await plantsAPI.getAll(filters);
      this.setState({
        plants: response.plants || response,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message || 'Failed to load plants',
        loading: false
      });
      console.error('Error fetching plants:', error);
    }
  }

  handleSearch(event) {
    this.setState({ searchTerm: event.target.value }, () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchPlants();
      }, 500);
    });
  }

  handleCategoryFilter(category) {
    this.setState({ selectedCategory: category }, () => {
      this.fetchPlants();
    });
  }

  handleAddToCart(plant, selectedPlanter = null, selectedColor = null, isGift = false) {
    this.setState(prevState => {
      const cartItem = {
        ...plant,
        selectedPlanter: selectedPlanter || (plant.planters && plant.planters[0]) || { name: 'Default', price: 0 },
        selectedColor: selectedColor || (plant.colors && plant.colors[0]) || 'Default',
        isGift: isGift,
        quantity: 1,
        cartId: Date.now() + Math.random()
      };

      const newCart = [...prevState.cart, cartItem];

      const cartUpdateEvent = new CustomEvent('cartUpdated', {
        detail: { cartCount: newCart.reduce((total, item) => total + item.quantity, 0) }
      });
      window.dispatchEvent(cartUpdateEvent);

      return {
        cart: newCart,
        selectedPlant: null,
        showCart: true
      };
    });
  }

  handleRemoveFromCart(cartId) {
    this.setState(prevState => ({
      cart: prevState.cart.filter(item => item.cartId !== cartId)
    }));
  }

  handleUpdateQuantity(cartId, newQuantity) {
    if (newQuantity < 1) return;

    this.setState(prevState => ({
      cart: prevState.cart.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    }));
  }

  handleBackToHome() {
    if (this.props.onBackToHome) this.props.onBackToHome();
  }

  handlePlantSelect(plant) {
    this.setState({ selectedPlant: plant });
  }

  handleBackToMenu() {
    this.setState({ selectedPlant: null });
  }

  handleShowCart() {
    this.setState({ showCart: true });
  }

  handleCloseCart() {
    this.setState({ showCart: false });
  }

  handleCheckout() {
    this.setState({
      showCart: false,
      showCheckout: true
    });
  }

  handleBackToCart() {
    this.setState({
      showCheckout: false,
      showCart: true
    });
  }

  get cartCount() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal() {
    return this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get filteredPlants() {
    const { plants, searchTerm, selectedCategory } = this.state;

    return plants.filter(plant => {
      const name = (plant.name || '').toLowerCase();
      const category = (plant.category || '').toLowerCase();
      const q = (searchTerm || '').toLowerCase();

      const matchesSearch = name.includes(q) || category.includes(q);
      const matchesCategory = selectedCategory === 'ALL' || plant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
  // 🌱 AI Chatbot Methods
toggleAI() {
  this.setState(prev => ({ aiOpen: !prev.aiOpen }));
}

handleAIInput(e) {
  this.setState({ aiMessage: e.target.value });
}

async sendAIMessage() {
  const message = this.state.aiMessage.trim();
  if (!message) return;

  // Add user message
  const newHistory = [
    ...this.state.aiChatHistory,
    { sender: "user", text: message }
  ];

  this.setState({
    aiChatHistory: newHistory,
    aiMessage: "",
    aiLoading: true
  });

  try {
    const response = await fetch("http://localhost:5001/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message })
    });

    const data = await response.json();

    const aiText = data.answer || "Sorry, I couldn't understand that.";

    this.setState(prev => ({
      aiChatHistory: [
        ...prev.aiChatHistory,
        { sender: "ai", text: aiText }
      ],
      aiLoading: false
    }));
  } catch (error) {
    this.setState(prev => ({
      aiChatHistory: [
        ...prev.aiChatHistory,
        { sender: "ai", text: "Error: Cannot connect to AI server." }
      ],
      aiLoading: false
    }));
  }
}


  get categories() {
    return ['ALL', 'INDOOR PLANTS', 'FLOWERING PLANTS', 'HERBS', 'SUCCULENTS'];
  }

  render() {
    const { searchTerm, selectedCategory, selectedPlant, cart, showCart, showCheckout, loading, error } = this.state;
    const filteredPlants = this.filteredPlants;

    if (showCheckout) {
      return (
        <CheckoutPage
          cart={cart}
          cartTotal={this.cartTotal}
          onBackToCart={this.handleBackToCart}

          // ✅ NEW PROP PASSED HERE
          onPaymentSuccess={this.handlePaymentSuccess}
        />
      );
    }

    if (selectedPlant) {
      // NOTE: ProductDetailPage is not imported. Since it is defined below, it will work in a local file setup.
      return (
        <ProductDetailPage
          plant={selectedPlant}
          onBackToMenu={this.handleBackToMenu}
          onAddToCart={this.handleAddToCart}
          onShowCart={this.handleShowCart}
          cartCount={this.cartCount}
        />
      );
    }

    if (showCart) {
      // NOTE: CartPage is not imported. Since it is defined below, it will work in a local file setup.
      return (
        <CartPage
          cart={cart}
          onCloseCart={this.handleCloseCart}
          onRemoveFromCart={this.handleRemoveFromCart}
          onUpdateQuantity={this.handleUpdateQuantity}
          cartTotal={this.cartTotal}
          onBackToMenu={this.handleBackToMenu}
          onCheckout={this.handleCheckout}
        />
      );
    }

    return (
      <div className="menu-page">
        {/* NOTE: Header, SearchSection, PlantGrid are not imported. Assuming they are defined in this file. */}
        <Header
          cartCount={this.cartCount}
          onBackToHome={this.handleBackToHome}
          onShowCart={this.handleShowCart}
        />

        <SearchSection
          searchTerm={searchTerm}
          onSearch={this.handleSearch}
          categories={this.categories}
          selectedCategory={selectedCategory}
          onCategoryFilter={this.handleCategoryFilter}
          onSearchButtonClick={this.fetchPlants}
        />

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading plants...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>Error: {error}</p>
            <button onClick={this.fetchPlants} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <PlantGrid
            plants={filteredPlants}
            onPlantSelect={this.handlePlantSelect}
          />
        )}
        {/* 🌱 Floating AI Button */}
<div className="ai-chat-btn" onClick={this.toggleAI}>🌱</div>

{/* 🌱 Chat Window */}
{this.state.aiOpen && (
  <div className="ai-chat-window">
    
    <div className="ai-chat-header">
      <span>AI Plant Assistant</span>
      <button onClick={this.toggleAI}>×</button>
    </div>

    <div className="ai-chat-body">
      {this.state.aiChatHistory.map((msg, idx) => (
        <div
          key={idx}
          className={`ai-chat-message ${msg.sender === "user" ? "user" : "ai"}`}
        >
          {msg.text}
        </div>
      ))}

      {this.state.aiLoading && (
        <div className="ai-typing">AI is typing...</div>
      )}
    </div>

    <div className="ai-chat-input-box">
      <input
        type="text"
        value={this.state.aiMessage}
        onChange={this.handleAIInput}
        placeholder="Ask something..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.sendAIMessage();   // ⬅⭐ Triggers the send function
          }
        }}
      />
      <button onClick={this.sendAIMessage}>Send</button>
    </div>

  </div>
)}


      </div>
    );
  }
}

// ----------------------------------------------------
// NESTED COMPONENTS (Fixes Applied for className syntax)
// ----------------------------------------------------

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
  }

  handleHomeClick() {
    if (this.props.onBackToHome) this.props.onBackToHome();
  }

  handleCartClick() {
    if (this.props.onShowCart) this.props.onShowCart();
  }

  render() {
    const { cartCount } = this.props;

    return (
      <header className="menu-header">
        <nav className="menu-nav">
          <div className="nav-section">
            <button className="back-btn" onClick={this.handleHomeClick}>
              ← Home
            </button>
            <h1 className="logo">Green Leaf</h1>
          </div>
          <div className="nav-section">
            <button className="cart-btn" onClick={this.handleCartClick}>
              Cart ({cartCount})
            </button>
          </div>
        </nav>
      </header>
    );
  }
}

class SearchSection extends Component {
  constructor(props) {
    super(props);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }

  handleSearchInput(event) {
    if (this.props.onSearch) this.props.onSearch(event);
  }

  handleCategoryClick(category) {
    if (this.props.onCategoryFilter) this.props.onCategoryFilter(category);
  }

  render() {
    const { searchTerm, categories, selectedCategory } = this.props;

    return (
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={this.handleSearchInput}
            className="search-input"
          />
          <button className="search-btn" onClick={this.props.onSearchButtonClick}>
            Search
          </button>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              // ❌ FIX: Incorrect template literal/string concatenation syntax
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              // className={category-btn `${selectedCategory === category ? 'active' : ''}`} 
              onClick={() => this.handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    );
  }
}

class PlantGrid extends Component {
  constructor(props) {
    super(props);
    this.handlePlantClick = this.handlePlantClick.bind(this);
  }

  handlePlantClick(plant) {
    if (this.props.onPlantSelect) this.props.onPlantSelect(plant);
  }

  render() {
    const { plants } = this.props;

    return (
      <section className="plant-grid-section">
        <div className="plants-grid">
          {plants.map(plant => (
            <PlantCard
              key={plant._id || plant.id}
              plant={plant}
              onPlantClick={this.handlePlantClick}
            />
          ))}
        </div>

        {plants.length === 0 && (
          <div className="no-plants">
            <p>No plants found matching your search.</p>
          </div>
        )}
      </section>
    );
  }
}

class PlantCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick() {
    if (this.props.onPlantClick) this.props.onPlantClick(this.props.plant);
  }

  handleMouseEnter() {
    this.setState({ isFlipped: true });
  }

  handleMouseLeave() {
    this.setState({ isFlipped: false });
  }

  render() {
    const { plant } = this.props;
    const { isFlipped } = this.state;

    return (
      <div
        // ❌ FIX: Incorrect template literal/string concatenation syntax
        className={`plant-card ${isFlipped ? 'flipped' : ''}`}
        // className={plant-card `${isFlipped ? 'flipped' : ''}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      >
        <div className="plant-card-inner">
          <div className="plant-card-front">
            <div className="plant-image">
              <img src={`http://localhost:5001${plant.image}`} alt={plant.name} className="plant-img" /> {/* FIXED IMAGE URL */}
              {plant.originalPrice > plant.price && (
                <div className="discount-badge">
                  Save ₹{plant.originalPrice - plant.price}
                </div>
              )}
              {plant.stock === 0 && (
                <div className="out-of-stock-badge">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="plant-info">
              <h3 className="plant-name">{plant.name}</h3>
              <span className="plant-category">{plant.category}</span>
              <div className="plant-rating">
                ⭐ {plant.rating} ({plant.reviews} reviews)
              </div>
              <p className="plant-description">{plant.description}</p>
              <div className="price-container">
                <span className="plant-price">₹{plant.price}</span>
                {plant.originalPrice > plant.price && (
                  <span className="original-price">₹{plant.originalPrice}</span>
                )}
              </div>
              <button
                // ❌ FIX: Incorrect template literal/string concatenation syntax
                className={`view-details-btn ${plant.stock === 0 ? 'disabled' : ''}`}
                // className={view-details-btn `${plant.stock === 0 ? 'disabled' : ''}`}
                disabled={plant.stock === 0}
              >
                {plant.stock === 0 ? 'Out of Stock' : 'View Details'}
              </button>
            </div>
          </div>

          <div className="plant-card-back">
            <div className="plant-details">
              <h3>{plant.name}</h3>
              <div className="care-info">
                <p><strong>Care Level:</strong> {plant.careLevel}</p>
                <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                <p className="plant-stock"><strong>Stock:</strong> {plant.stock} available</p>
              </div>
              <p className="full-description">{plant.description}</p>
              <div className="price-back">₹{plant.price}</div>
              <button
                // ❌ FIX: Incorrect template literal/string concatenation syntax
                className={`view-details-btn-back ${plant.stock === 0 ? 'disabled' : ''}`}
                // className={view-details-btn-back `${plant.stock === 0 ? 'disabled' : ''}`}
                disabled={plant.stock === 0}
              >
                {plant.stock === 0 ? 'Out of Stock' : 'View Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ProductDetailPage extends Component {
  constructor(props) {
    super(props);
    const planters = (this.props.plant && this.props.plant.planters) || [];
    const colors = (this.props.plant && this.props.plant.colors) || [];
    this.state = {
      selectedPlanter: planters[0] || { name: 'Default', price: 0 },
      selectedColor: colors[0] || (colors.length ? colors[0] : 'Default'),
      isGift: false,
      pinCode: '',
      deliveryAvailable: false
    };

    this.handlePlanterSelect = this.handlePlanterSelect.bind(this);
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleGiftToggle = this.handleGiftToggle.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handlePinCodeChange = this.handlePinCodeChange.bind(this);
    this.handleCheckDelivery = this.handleCheckDelivery.bind(this);
  }

  handlePlanterSelect(planter) {
    this.setState({ selectedPlanter: planter });
  }

  handleColorSelect(color) {
    this.setState({ selectedColor: color });
  }

  handleGiftToggle() {
    this.setState(prevState => ({ isGift: !prevState.isGift }));
  }

  handlePinCodeChange(event) {
    this.setState({ pinCode: event.target.value });
  }

  handleCheckDelivery() {
    if (this.state.pinCode.length === 6) {
      this.setState({ deliveryAvailable: true });
      setTimeout(() => {
        this.setState({ deliveryAvailable: false });
      }, 3000);
    }
  }

  handleAddToCart() {
    if (this.props.onAddToCart) {
      this.props.onAddToCart(
        this.props.plant,
        this.state.selectedPlanter,
        this.state.selectedColor,
        this.state.isGift
      );
    }
  }

  render() {
    const { plant, onBackToMenu, onShowCart, cartCount } = this.props;
    const { selectedPlanter, selectedColor, isGift, pinCode, deliveryAvailable } = this.state;

    return (
      <div className="product-detail-page">
        <header className="product-header">
          <nav className="product-nav">
            <button className="back-btn" onClick={onBackToMenu}>
              ← Back to Plants
            </button>
            <h1 className="logo">Green Leaf</h1>
            <button className="cart-btn" onClick={onShowCart}>
              Cart ({cartCount})
            </button>
          </nav>
        </header>

        <div className="product-container">
          <div className="product-image-section">
            <img src={`http://localhost:5001${plant.image}`} alt={plant.name} className="product-image" /> {/* FIXED IMAGE URL */}
            {plant.stock === 0 && (
              <div className="out-of-stock-overlay">
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="breadcrumb">
              Home / Plants / {plant.name}
            </div>

            <h1 className="product-title">{plant.name}</h1>

            <div className="product-rating">
              <span className="rating">⭐ {plant.rating}</span>
              <span className="reviews">({plant.reviews} Reviews)</span>
              <span className="stock-info">• {plant.stock} in stock</span>
            </div>

            <div className="price-section">
              <span className="current-price">₹{plant.price}</span>
              {plant.originalPrice > plant.price && (
                <span className="original-price">₹{plant.originalPrice}</span>
              )}
              <div className="price-note">(Incl. of all taxes)</div>
            </div>

            <div className="planter-selection">
              <h3>SELECT PLANTER</h3>
              <div className="planter-options">
                {(plant.planters || []).map((planter, index) => (
                  <div
                    key={index}
                    // ❌ FIX: Incorrect template literal/string concatenation syntax
                    className={`planter-option ${selectedPlanter && selectedPlanter.name === planter.name ? 'selected' : ''}`}
                    // className={planter-option `${selectedPlanter && selectedPlanter.name === planter.name ? 'selected' : ''}`}
                    onClick={() => this.handlePlanterSelect(planter)}
                  >
                    <div className="planter-name">{planter.name}</div>
                    <div className="planter-price">₹{planter.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="color-selection">
              <h3>COLOR - {selectedColor}</h3>
              <div className="color-options">
                {(plant.colors || []).map((color, index) => (
                  <div
                    key={index}
                    // ❌ FIX: Incorrect template literal/string concatenation syntax
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    // className={color-option `${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => this.handleColorSelect(color)}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

            <div className="delivery-check">
              <h3>Check Delivery</h3>
              <div className="pin-code-input">
                <input
                  type="text"
                  placeholder="Enter PIN code"
                  value={pinCode}
                  onChange={this.handlePinCodeChange}
                  maxLength="6"
                />
                <button onClick={this.handleCheckDelivery}>Check</button>
              </div>
              {deliveryAvailable && (
                <div className="delivery-available">✅ Delivery available to your area!</div>
              )}
            </div>

            <div className="gift-option">
              <label className="gift-checkbox">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={this.handleGiftToggle}
                />
                <span className="checkmark"></span>
                Make This a Gift
              </label>
            </div>

            <button
              // ❌ FIX: Incorrect template literal/string concatenation syntax
              className={`add-to-cart-btn-large ${plant.stock === 0 ? 'disabled' : ''}`}
              // className={add-to-cart-btn-large `${plant.stock === 0 ? 'disabled' : ''}`}
              onClick={this.handleAddToCart}
              disabled={plant.stock === 0}
            >
              {plant.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.handleQuantityDecrease = this.handleQuantityDecrease.bind(this);
    this.handleQuantityIncrease = this.handleQuantityIncrease.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  handleQuantityDecrease(item) {
    if (this.props.onUpdateQuantity) this.props.onUpdateQuantity(item.cartId, item.quantity - 1);
  }

  handleQuantityIncrease(item) {
    if (this.props.onUpdateQuantity) this.props.onUpdateQuantity(item.cartId, item.quantity + 1);
  }

  handleCheckout() {
    if (this.props.onCheckout) this.props.onCheckout();
  }

  get savings() {
    return (this.props.cart || []).reduce((total, item) => {
      if (item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  }

  render() {
    const { cart = [], onCloseCart, onRemoveFromCart, cartTotal } = this.props;

    return (
      <div className="cart-page">
        <header className="cart-header">
          <nav className="cart-nav">
            <button className="back-btn" onClick={onCloseCart}>
              ← Continue Shopping
            </button>
            <h1 className="logo">Green Leaf</h1>
            <div className="cart-title">CART</div>
          </nav>
        </header>

        <div className="cart-container">
          <div className="cart-items-section">
            <div className="delivery-notice">
              🚚 You're getting Free Delivery
            </div>

            {cart.map(item => (
              <div key={item.cartId} className="cart-item">
                <img src={`http://localhost:5001${item.image}`} alt={item.name} className="cart-item-image" /> {/* FIXED IMAGE URL */}
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{(item.selectedPlanter && item.selectedPlanter.name) || ''} • {item.selectedColor}</p>
                  {item.isGift && <span className="gift-tag">🎁 Gift</span>}
                  {item.stock === 0 && <span className="out-of-stock-tag">Out of Stock</span>}
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => this.handleQuantityDecrease(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => this.handleQuantityIncrease(item)}>+</button>
                  </div>
                  <div className="item-price">₹{item.price * item.quantity}</div>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveFromCart(item.cartId)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className="replacement-guarantee">
              🔒 14 days Guaranteed Replacement of Damaged Product
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>₹{cartTotal}</span>
            </div>
            {this.savings > 0 && (
              <div className="savings-line">
                <span>You saved:</span>
                <span>₹{this.savings}</span>
              </div>
            )}
            <div className="shipping-note">
              Shipping Calculated at Checkout
            </div>
            <div className="total-line">
              <span>To Pay:</span>
              <span>₹{cartTotal}</span>
            </div>
            <button className="checkout-btn" onClick={this.handleCheckout}>
              CHECKOUT – ₹{cartTotal}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MenuPage;