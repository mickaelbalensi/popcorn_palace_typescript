// src/components/booking/BookingForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { Showtime } from '../../types/Showtime';
import { useUser } from '../auth/UserContext';
import SeatSelector from './SeatSelector';

interface BookingFormProps {
  showtime: Showtime;
}

const BookingForm: React.FC<BookingFormProps> = ({ showtime }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedSeat) {
      setError('Please select a seat to continue');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const booking = await bookingService.createBooking(
        showtime.id,
        selectedSeat,
        user.id
      );
      
      navigate('/booking/confirmation', { 
        state: { 
          booking: {
            ...booking,
            movieTitle: showtime.movieTitle,
            theaterName: showtime.theaterName,
            startTime: showtime.startTime
          } 
        } 
      });
    } catch (err) {
      setError('Failed to book ticket. The seat may have been taken.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

// Just for testing, all 3 seats, one it taken
  const mockAvailableSeats = Array.from(
    { length: 80 }, 
    (_, i) => i + 1
  ).filter(seat => seat % 3 !== 0);   
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Book Your Seat</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">{showtime.movieTitle}</h3>
        <p><span className="font-medium">Theater:</span> {showtime.theaterName}</p>
        <p><span className="font-medium">Date & Time:</span> {new Date(showtime.startTime).toLocaleString()}</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <SeatSelector
          availableSeats={showtime.availableSeats || mockAvailableSeats}
          selectedSeat={selectedSeat}
          onSeatSelect={setSelectedSeat}
        />
        
        <div className="mb-4">
          <p><span className="font-medium">Selected Seat:</span> {selectedSeat || 'None'}</p>
        </div>
        
        <button
          type="submit"
          disabled={!selectedSeat || isLoading}
          className={`
            w-full py-2 px-4 rounded font-bold text-white
            ${!selectedSeat || isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
          `}
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;