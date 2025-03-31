// src/pages/MyBookingsPage.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/Booking';
import { useUser } from '../components/auth/UserContext';

const MyBookingsPage: React.FC = () => {
  const { user, isLoggedIn } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await bookingService.getUserBookings(user.id);
        setBookings(data);
      } catch (err) {
        setError('Failed to load your bookings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading your bookings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="text-center p-8">
          <p className="mb-4">You don't have any bookings yet.</p>
          <Link to="/showtimes" className="text-blue-500 hover:underline">
            Browse Showtimes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-2">{booking.movieTitle || 'Movie'}</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Theater:</span> {booking.theaterName || 'Theater'}</p>
                <p><span className="font-medium">Time:</span> {booking.startTime ? new Date(booking.startTime).toLocaleString() : 'Unknown'}</p>
                <p><span className="font-medium">Seat:</span> {booking.seatNumber}</p>
                <p><span className="font-medium">Booking ID:</span> <span className="font-mono text-sm">{booking.id}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;