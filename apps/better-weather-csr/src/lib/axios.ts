// lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Set a default base URL for all requests
    timeout: 10000, // Set a default timeout for requests
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      indexes: null, // Customize how query parameters are serialized
    },
  });

export default axiosInstance;