// src/services/showtimeService.ts
import { showtimeApi } from './api';
import { Showtime } from '../types/Showtime';

export const showtimeService = {
  async getShowtimes(): Promise<Showtime[]> {
    const response = await showtimeApi.get('/showtimes');
    return response.data;
  },
  
  async getShowtimeDetails(id: number): Promise<Showtime> {
    const response = await showtimeApi.get(`/showtimes/${id}`);
    return response.data;
  }
};