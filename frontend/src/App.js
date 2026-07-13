import React, { Component } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentPage: 'login' // 'login', 'home', 'menu'
    };
    
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNavigateToMenu = this.handleNavigateToMenu.bind(this);
    this.handleBackToHome = this.handleBackToHome.bind(this);
    
    // Listen for custom events
    this.handleSectionChange = this.handleSectionChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('sectionChanged', this.handleSectionChange);
  }

  componentWillUnmount() {
    window.removeEventListener('sectionChanged', this.handleSectionChange);
  }

  handleSectionChange(event) {
    console.log('Section changed to:', event.detail.section);
  }

  handleLogin(credentials) {
    console.log('Login attempt:', credentials);
    // Using fetch() to get data from backend (simulated)
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      this.setState({ 
        user: { 
          email: credentials.email, 
          name: credentials.email.split('@')[0]
        },
        currentPage: 'home'
      });
    })
    .catch(error => {
      console.error('Login error:', error);
      // Fallback to local state update for demo
      this.setState({ 
        user: { 
          email: credentials.email, 
          name: credentials.email.split('@')[0]
        },
        currentPage: 'home'
      });
    });
  }

  handleRegister(userData) {
    console.log('Registration attempt:', userData);
    // Using fetch() to send data to backend (simulated)
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      this.setState({ 
        user: { 
          email: userData.email, 
          name: userData.name 
        },
        currentPage: 'home'
      });
    })
    .catch(error => {
      console.error('Registration error:', error);
      // Fallback to local state update for demo
      this.setState({ 
        user: { 
          email: userData.email, 
          name: userData.name 
        },
        currentPage: 'home'
      });
    });
  }

  handleGoogleLogin() {
    console.log('Google login attempted');
    alert('Google login would be implemented here with proper OAuth flow');
  }

  handleLogout() {
    // Using fetch() to send logout request to backend (simulated)
    fetch('/api/logout', {
      method: 'POST'
    })
    .then(() => {
      this.setState({ user: null, currentPage: 'login' });
    })
    .catch(error => {
      console.error('Logout error:', error);
      this.setState({ user: null, currentPage: 'login' });
    });
  }

  handleNavigateToMenu() {
    console.log('Navigating to menu page...');
    this.setState({ currentPage: 'menu' });
  }

  handleBackToHome() {
    console.log('Navigating back to home page...');
    this.setState({ currentPage: 'home' });
  }

  render() {
    const { user, currentPage } = this.state;

    // Render different pages based on currentPage state
    if (currentPage === 'login') {
      return (
        <LoginPage 
          onLogin={this.handleLogin}
          onRegister={this.handleRegister}
          onGoogleLogin={this.handleGoogleLogin}
        />
      );
    } else if (currentPage === 'home') {
      return (
        <HomePage 
          user={user}
          onLogout={this.handleLogout}
          onNavigateToMenu={this.handleNavigateToMenu}
        />
      );
    } else if (currentPage === 'menu') {
      return (
        <MenuPage 
          onBackToHome={this.handleBackToHome}
        />
      );
    }
  }
}

export default App;