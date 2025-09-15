/**
 * API Service
 * Centralizes all API calls to the backend
 * Features:
 * - Axios instance configuration
 * - Authentication token management
 * - Auth endpoints (login, register)
 * - Task CRUD operations
 */

import axios from 'axios';

// Base URL for all API calls
const API_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Tasks API calls
export const getTasks = (category) => {
  const url = category ? `/tasks?category=${category}` : '/tasks';
  return api.get(url);
};
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.patch(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
