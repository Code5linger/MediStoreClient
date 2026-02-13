// import axios from 'axios';

// const api = axios.create({
//   // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
//   baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
//   // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;

import axios from 'axios';

// Use /api prefix - will be rewritten by Next.js
const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL, // ← Changed to '/api'
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
