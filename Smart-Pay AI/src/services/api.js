import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => api.post('/api/users/signup', data);
export const login = (data) => api.post('/api/users/login', data);
export const getProfile = () => api.get('/api/users/profile');

// Wallet APIs
export const getWallet = () => api.get('/api/wallet/');
export const addMoney = (amount) => api.post('/api/wallet/add-money', { amount });
export const setMonthlyLimit = (monthly_limit) => api.post('/api/wallet/set-limit', { monthly_limit });
export const makePayment = (data) => api.post('/api/wallet/payment', data);
export const getTransactions = (limit = 50) => api.get(`/api/wallet/transactions?limit=${limit}`);

export default api;