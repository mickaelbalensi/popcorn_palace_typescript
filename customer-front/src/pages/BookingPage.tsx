// src/pages/BookingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { showtimeService } from '../services/showtimesService';
import { Showtime } from '../types/Showtime';
import { useUser } from '../components/auth/UserContext';
import BookingForm from '../components/booking/BookingForm';

const BookingPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const { isLoggedIn } = useUser();
  
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShowtime = async () => {
      if (!showtimeId) {
        setError('Invalid showtime ID');
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await showtimeService.getShowtimeDetails(parseInt(showtimeId));
        setShowtime(data);
      } catch (err) {
        setError('Failed to load showtime details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShowtime();
  }, [showtimeId]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading booking details...</div>;
  }

  if (error || !showtime) {
    return <div className="text-center p-8 text-red-500">{error || 'Showtime not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <BookingForm showtime={showtime} />
    </div>
  );
};

export default BookingPage;