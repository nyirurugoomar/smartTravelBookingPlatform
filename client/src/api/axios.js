import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smarttravelbookingplatform-backend.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// adding authorized token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 