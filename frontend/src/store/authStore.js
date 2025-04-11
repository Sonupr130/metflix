import { create } from 'zustand';
import axios from 'axios';
import { apiUrl } from '../api/authApi';

const authStore = create((set) => ({
  admin: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password }, {
        withCredentials: true
      });
      
      set({ 
        admin: response.data, 
        isAuthenticated: true, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post(`${apiUrl}/logout`, {}, {
        withCredentials: true
      });
      set({ 
        admin: null, 
        isAuthenticated: false, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Logout failed', 
        loading: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${apiUrl}/profile`, {
        withCredentials: true
      });
      set({ 
        admin: response.data, 
        isAuthenticated: true, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        admin: null, 
        isAuthenticated: false, 
        loading: false 
      });
      return null;
    }
  },

  clearError: () => set({ error: null })
}));

export default authStore;