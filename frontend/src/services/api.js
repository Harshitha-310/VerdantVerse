// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: userData,
  }),
  getProfile: () => apiCall('/auth/profile'),
  updateProfile: (profileData) => apiCall('/auth/profile', {
    method: 'PUT',
    body: profileData,
  }),
};

// Plants API calls
export const plantsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/plants?${params.toString()}`);
  },
  getById: (id) => apiCall(`/plants/${id}`),
  getByCategory: (category) => apiCall(`/plants/category/${category}`),
};

// Orders API calls
export const ordersAPI = {
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: orderData,
  }),
  getUserOrders: () => apiCall('/orders/my-orders'),
  getById: (id) => apiCall(`/orders/${id}`),
};

// Admin API calls
export const adminAPI = {
  getDashboard: () => apiCall('/admin/dashboard'),
  getAllOrders: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/admin/orders?${params.toString()}`);
  },
  createPlant: (plantData) => apiCall('/admin/plants', {
    method: 'POST',
    body: plantData,
  }),
  updatePlant: (id, plantData) => apiCall(`/admin/plants/${id}`, {
    method: 'PUT',
    body: plantData,
  }),
  deletePlant: (id) => apiCall(`/admin/plants/${id}`, {
    method: 'DELETE',
  }),
};
// ⭐ ADD THIS NEW BLOCK AT THE BOTTOM BEFORE 'export default apiCall'

export const aiAPI = {
  ask: (question) =>
    apiCall('/ai/recommend', {
      method: 'POST',
      body: { question }
    }),
};


export default apiCall;