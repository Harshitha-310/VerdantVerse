import React, { Component } from 'react';
import './HomePage.css';
import backgroundImage from '../assets/image1.jpg';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'home'
    };
    
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleShopPlants = this.handleShopPlants.bind(this);
    this.scrollToSection = this.scrollToSection.bind(this);
  }

  handleNavigation(section) {
    this.setState({ activeSection: section });
    this.scrollToSection(section);
  }

  handleShopPlants() {
    console.log('Shop Plants clicked - navigating to menu page');
    this.props.onNavigateToMenu();
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const { user, onLogout } = this.props;
    const { activeSection } = this.state;

    return (
      <div className="home-page">
        <Header 
          activeSection={activeSection}
          onNavigation={this.handleNavigation}
          user={user}
          onLogout={onLogout}
        />
        
        <HeroSection 
          onShopPlants={this.handleShopPlants}
          backgroundImage={backgroundImage}
        />
        
        <CareTipsSection />
        
        <Footer />
      </div>
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleNavClick(section) {
    this.props.onNavigation(section);
  }

  handleLogoutClick() {
    this.props.onLogout();
  }

  render() {
    const { activeSection, user } = this.props;

    return (
      <header className="main-header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>GreenLeaf</h1>
          </div>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => this.handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeSection === 'care' ? 'active' : ''}`}
                onClick={() => this.handleNavClick('care')}
              >
                Care Tips
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => this.handleNavClick('contact')}
              >
                Contact
              </button>
            </li>
          </ul>
          <div className="nav-user">
            <span>Welcome, {user?.name || 'Gardener'}</span>
            <button className="logout-btn" onClick={this.handleLogoutClick}>
              Logout
            </button>
          </div>
        </nav>
      </header>
    );
  }
}

class HeroSection extends Component {
  constructor(props) {
    super(props);
    this.handleShopClick = this.handleShopClick.bind(this);
  }

  handleShopClick() {
    this.props.onShopPlants();
  }

  render() {
    const { backgroundImage } = this.props;
    
    return (
      <section 
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Bring Nature Into Your Home</h2>
          <p>Discover our curated collection of beautiful, healthy plants with detailed care guides to help them thrive.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={this.handleShopClick}>
              Shop Plants
            </button>
          </div>
        </div>
      </section>
    );
  }
}

class CareTipsSection extends Component {
  render() {
    return (
      <section id="care" className="care-tips-section">
        <div className="container">
          <h2>Plant Care Tips</h2>
          <div className="care-tips-grid">
            <div className="care-tip-card">
              <h3>🌞 Light Requirements</h3>
              <p>Most indoor plants thrive in bright, indirect light. Avoid direct sunlight which can scorch leaves.</p>
            </div>
            <div className="care-tip-card">
              <h3>💧 Watering Guide</h3>
              <p>Water when top inch of soil is dry. Overwatering is the most common cause of plant problems.</p>
            </div>
            <div className="care-tip-card">
              <h3>🌡️ Temperature</h3>
              <p>Keep plants in temperatures between 65-75°F (18-24°C). Avoid drafts and sudden temperature changes.</p>
            </div>
            <div className="care-tip-card">
              <h3>💨 Humidity</h3>
              <p>Most tropical plants love humidity. Mist leaves regularly or use a humidifier.</p>
            </div>
            <div className="care-tip-card">
              <h3>🌱 Fertilizing</h3>
              <p>Feed plants during growing season (spring-summer) with balanced liquid fertilizer every 2-4 weeks.</p>
            </div>
            <div className="care-tip-card">
              <h3>🪴 Repotting</h3>
              <p>Repot when roots outgrow container, typically every 1-2 years in spring.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: new Date().getFullYear()
    };
  }

  render() {
    return (
      <footer id="contact" className="main-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Plants Grow People</h3>

          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>ABOUT US</h4>
              <ul>
                <li>Our Story</li>
                <li>Contact Us</li>
                <li>Careers</li>
                <li>Locate Stores</li>
                <li>Own Grown</li>
                <li>Garden Services & Maintenance</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>CUSTOMER CARE</h4>
              <ul>
                <li>Take The Plant Quiz</li>
                <li>Shipping Policy</li>
                <li>Terms and Conditions</li>
                <li>Privacy Policy</li>
                <li>Track Order</li>
                <li>FAQs</li>
                <li>Order Related Policy</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>OFFERS & REWARDS</h4>
              <ul>
                <li>Plant Parent Rewards Club</li>
                <li>Sapling Coupons</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>GET IN TOUCH</h4>
              <div className="contact-info">
                <p>WhatsApp us at: 7075854270</p>
                <p>Call: +91-9129912991</p>
                <p>Call: +91-9392867536</p>
                <p>Call: +91-8328338206</p>
                <p>Email: suprajahasniharshidivyaanu@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4>SIGN UP FOR OUR NEWSLETTER</h4>
            <div className="newsletter-input">
              <input type="email" placeholder="Enter email address" />
              <button>Subscribe</button>
            </div>
            <p>For plant care tips, our featured plant of the week, exclusive offers and discounts</p>
          </div>

          <div className="footer-social">
            <h4>FOLLOW US</h4>
            <div className="social-icons">
              <span>+</span>
              <span>X</span>
              <span>☐</span>
              <span>in</span>
              <span>☐</span>
            </div>
          </div>

          

          <div className="footer-bottom">
            <p>&copy; {this.state.currentYear} GreenLeaf. Bringing nature to your doorstep. 🌱</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default HomePage;