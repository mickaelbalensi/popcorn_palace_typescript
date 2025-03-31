// src/pages/ShowtimesPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showtimeService } from '../services/showtimesService';
import { Showtime } from '../types/Showtime';
import { useUser } from '../components/auth/UserContext';

const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const data = await showtimeService.getShowtimes();
        setShowtimes(data);
      } catch (err) {
        setError('Failed to load showtimes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShowtimes();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Please log in to view showtimes.</p>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Log In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading showtimes...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Showtimes</h1>
      
      {showtimes.length === 0 ? (
        <p>No showtimes available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showtimes.map((showtime) => (
            <div key={showtime.id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{showtime.movieTitle}</h2>
              <p className="mb-1"><span className="font-medium">Theater:</span> {showtime.theaterName}</p>
              <p className="mb-3">
                <span className="font-medium">Time:</span>{' '}
                {new Date(showtime.startTime).toLocaleString()}
              </p>
              <Link
                to={`/booking/${showtime.id}`}
                className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Book Seats
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;