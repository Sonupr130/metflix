// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchMoviesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/movies/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchAllMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};