// src/types/Showtime.ts
export interface Showtime {
    id: number;
    movieId: number;
    theaterId: number;
    startTime: string;
    endTime: string;
    movieTitle?: string;
    theaterName?: string;
    availableSeats?: number[];
  }