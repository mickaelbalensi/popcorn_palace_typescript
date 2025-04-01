import axios from 'axios';

export const bookingApi = axios.create({
  baseURL: import.meta.env.VITE_BOOKINGS_SERVICE_URL || 'http://localhost:3005',
  headers: { 'Content-Type': 'application/json' },
});

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_SERVICE_URL || 'http://localhost:3004',
  headers: { 'Content-Type': 'application/json' },
});

export const showtimeApi = axios.create({
  baseURL: import.meta.env.VITE_SHOWTIMES_SERVICE_URL || 'http://localhost:3003',
  headers: { 'Content-Type': 'application/json' },
});
