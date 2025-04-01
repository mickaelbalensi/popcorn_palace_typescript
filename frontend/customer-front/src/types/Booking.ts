// src/types/Booking.ts
export interface Booking {
    id: string;
    showtimeId: number;
    seatNumber: number;
    userId: string;
    movieTitle?: string;
    theaterName?: string;
    startTime?: string;
  }