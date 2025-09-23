import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

export const emotionService = {
  analyzeEmotion: async (imageData: string) => {
    const response = await api.post('/analyze-emotion', { image: imageData });
    return response.data;
  },

  getRecommendations: async (emotion: string) => {
    const response = await api.post('/recommendations', { emotion });
    return response.data;
  },

  getMoodHistory: async () => {
    const response = await api.get('/mood-history');
    return response.data;
  },

  savePlaylist: async (name: string, emotion: string, tracks: any[]) => {
    const response = await api.post('/save-playlist', { name, emotion, tracks });
    return response.data;
  },
};