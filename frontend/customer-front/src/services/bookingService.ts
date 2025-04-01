// src/services/bookingService.ts
import { bookingApi } from './api';
import { Booking } from '../types/Booking';

export const bookingService = {
  async createBooking(showtimeId: number, seatNumber: number, userId: string): Promise<Booking> {
    console.log('Creating booking for showtimeId:', showtimeId, 'seatNumber:', seatNumber, 'userId:', userId);
    const response = await bookingApi.post('/bookings', {
      showtimeId,
      seatNumber,
      userId
    });
    return response.data;
  },
  
  async getUserBookings(userId: string): Promise<Booking[]> {
    const response = await bookingApi.get(`/bookings/user/${userId}`);
    return response.data;
  }
};