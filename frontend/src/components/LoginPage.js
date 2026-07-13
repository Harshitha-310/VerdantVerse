// LoginPage.jsx
import React, { Component } from 'react';
import { authAPI } from '../services/api';
import './LoginPage.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      errors: {},
      loading: false
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, [name]: '' }
    });
  };

  // LOGIN SUBMIT
  handleLoginSubmit = async (event) => {
    event.preventDefault();
    const errors = this.validateLoginForm();

    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true, errors: {} });

      try {
        const { email, password } = this.state;

        console.log('LOGIN sending:', { email, password });

        const response = await authAPI.login({ email, password });

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role
        }));

        this.setState({ loading: false });
        this.props.onLogin && this.props.onLogin(response);

      } catch (error) {
        console.error('Login API error:', error);
        const resp = error.response && error.response.data ? error.response.data : null;
        const message = resp && resp.message ?
          resp.message :
          (error.message || 'Login failed. Please try again.');

        this.setState({
          errors: { general: message },
          loading: false
        });
      }
    } else {
      this.setState({ errors });
    }
  };

  // REGISTER SUBMIT
  handleRegisterSubmit = async (event) => {
    event.preventDefault();

    console.log('Register submit state:', this.state);

    const errors = this.validateRegisterForm();
    console.log('Register validation errors (frontend):', errors);

    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true, errors: {} });

      try {
        const { name, email, password, confirmPassword } = this.state;

        console.log('REGISTER sending payload:', { name, email, password, confirmPassword });

        const response = await authAPI.register({ name, email, password, confirmPassword });

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role
        }));

        this.setState({ loading: false });

        if (this.props.onRegister) {
          this.props.onRegister(response);
        } else {
          this.props.onLogin && this.props.onLogin(response);
        }

      } catch (error) {
        console.error('Register API error:', error);
        const resp = error.response && error.response.data ? error.response.data : null;

        let serverMsg = 'Registration failed. Please try again.';
        if (resp) {
          if (Array.isArray(resp.errors)) {
            serverMsg = resp.errors.map(e => `${e.field}: ${e.message}`).join('; ');
          } else if (resp.message) {
            serverMsg = resp.message;
          } else {
            serverMsg = JSON.stringify(resp);
          }
        } else if (error.message) {
          serverMsg = error.message;
        }

        this.setState({
          errors: { general: serverMsg },
          loading: false
        });
      }
    } else {
      this.setState({ errors });
    }
  };

  validateLoginForm() {
    const errors = {};
    const { email, password } = this.state;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  }

  validateRegisterForm() {
    const errors = {};
    const { name, email, password, confirmPassword } = this.state;

    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2 || name.trim().length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = 'Name can only contain letters and spaces';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    const pwRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!pwRegex.test(password)) {
      errors.password = 'Password must contain at least one lowercase, one uppercase, and one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  }

  toggleForm = () => {
    this.setState({
      isLogin: !this.state.isLogin,
      errors: {},
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  handleGoogleLogin = () => {
    this.props.onGoogleLogin && this.props.onGoogleLogin();
  };

  render() {
    const { isLogin, errors, loading } = this.state;

    return (
      <main className="login-page">
        <section className="login-container">
          <header className="login-header">
            <h1>Green Leaf</h1>
            <p>Bring nature into your home with our premium plants</p>
          </header>

          <article className="form-container">
            {isLogin ? (
              <LoginForm
                email={this.state.email}
                password={this.state.password}
                errors={errors}
                loading={loading}
                onInputChange={this.handleInputChange}
                onSubmit={this.handleLoginSubmit}
                onToggleForm={this.toggleForm}
                onGoogleLogin={this.handleGoogleLogin}
              />
            ) : (
              <RegisterForm
                name={this.state.name}
                email={this.state.email}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                errors={errors}
                loading={loading}
                onInputChange={this.handleInputChange}
                onSubmit={this.handleRegisterSubmit}
                onToggleForm={this.toggleForm}
                onGoogleLogin={this.handleGoogleLogin}
              />
            )}
          </article>
        </section>
      </main>
    );
  }
}

class LoginForm extends Component {
  render() {
    const { email, password, errors, loading, onInputChange, onSubmit, onToggleForm, onGoogleLogin } = this.props;

    return (
      <div className="form-section">
        <h2>Sign In</h2>

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        

        <footer className="form-footer">
          <p>
            Don't have an account?
            <button type="button" className="link-button" onClick={onToggleForm} disabled={loading}>
              Sign Up
            </button>
          </p>
        </footer>
      </div>
    );
  }
}

class RegisterForm extends Component {
  render() {
    const { name, email, password, confirmPassword, errors, loading, onInputChange, onSubmit, onToggleForm, onGoogleLogin } = this.props;

    return (
      <div className="form-section">
        <h2>Create Account</h2>

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onInputChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={loading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        

        <footer className="form-footer">
          <p>
            Already have an account?
            <button type="button" className="link-button" onClick={onToggleForm} disabled={loading}>
              Sign In
            </button>
          </p>
        </footer>
      </div>
    );
  }
}

export default LoginPage;
