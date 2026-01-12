import axios from 'axios';

// Create axios instance
const service = axios.create({
  baseURL: '/api', // Proxy will be needed or absolute URL
  timeout: 5000 // Request timeout
});

// Request interceptor
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      // Handle error (e.g. token expired)
      if (res.code === 401 || res.code === 403) {
         // redirect to login
         window.location.href = '/login';
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res.data;
    }
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default service;
