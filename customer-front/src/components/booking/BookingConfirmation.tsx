// src/components/booking/BookingConfirmation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Booking } from '../../types/Booking';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const { booking } = location.state as { booking: Booking };

  if (!booking) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">No booking information found.</p>
        <Link to="/showtimes" className="text-blue-500 hover:underline">
          Return to Showtimes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
        <p className="font-bold text-green-700">Booking Confirmed!</p>
        <p className="text-green-700">Your ticket has been reserved successfully.</p>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Booking Details</h2>
      
      <div className="mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Movie:</span>
          <span>{booking.movieTitle}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Theater:</span>
          <span>{booking.theaterName}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Date & Time:</span>
          <span>{new Date(booking.startTime || '').toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Seat Number:</span>
          <span>{booking.seatNumber}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Booking ID:</span>
          <span className="font-mono text-sm">{booking.id}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Link
          to="/my-bookings"
          className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          to="/showtimes"
          className="block w-full text-center bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Book Another Ticket
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;