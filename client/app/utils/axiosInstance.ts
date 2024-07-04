import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://agroonai-project-backend.onrender.com',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
