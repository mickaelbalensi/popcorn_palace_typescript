import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import .meta.env.VITE_SHOWTIMES_SERVICE_URL || 'http://localhost:3003';
const MOVIES_API_URL = import.meta.env.VITE_MOVIES_SERVICE_URL || 'http://localhost:3001';
const THEATERS_API_URL = import.meta.env.VITE_THEATERS_SERVICE_URL || 'http://localhost:3002';

interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
  movieName?: string;
  theaterName?: string;
}

interface Movie {
  id: number;
  title: string;
}

interface Theater {
  id: number;
  name: string;
}

const ShowtimesList: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [showtimesRes, moviesRes, theatersRes] = await Promise.all([
          axios.get(`${API_URL}/showtimes`),
          axios.get(`${MOVIES_API_URL}/movies/all`),
          axios.get(`${THEATERS_API_URL}/theaters`)
        ]);
        
        const moviesData = moviesRes.data;
        const theatersData = theatersRes.data;
        
        const enhancedShowtimes = showtimesRes.data.map((showtime: Showtime) => {
          const movie = moviesData.find((m: Movie) => m.id === showtime.movieId);
          const theater = theatersData.find((t: Theater) => t.id === showtime.theaterId);
          
          return {
            ...showtime,
            movieName: movie ? movie.title : 'Unknown Movie',
            theaterName: theater ? theater.name : 'Unknown Theater'
          };
        });
        
        setShowtimes(enhancedShowtimes);
        setMovies(moviesData);
        setTheaters(theatersData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load showtimes. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this showtime?')) {
      try {
        await axios.delete(`${API_URL}/showtimes/${id}`);
        setShowtimes(showtimes.filter(showtime => showtime.id !== id));
      } catch (err) {
        setError('Failed to delete showtime. Please try again.');
        console.error('Error deleting showtime:', err);
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="loading-spinner">Loading showtimes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (showtimes.length === 0) {
    return (
      <div className="no-showtimes">
        <h3>No showtimes found</h3>
        <p>Get started by adding a new showtime.</p>
        <Link to="/showtimes/add" className="button add-first">Add Your First Showtime</Link>
      </div>
    );
  }

  return (
    <div className="showtimes-container">
      <div className="page-header">
        <h2>All Showtimes</h2>
        <Link to="/showtimes/add" className="button add-showtime">Add New Showtime</Link>
      </div>
      
      <div className="showtime-grid">
        {showtimes.map(showtime => (
          <div key={showtime.id} className="showtime-card">
            <div className="showtime-header">
              <h3>{showtime.movieName}</h3>
              <span className="showtime-price">${showtime.price}</span>
            </div>
            <div className="showtime-details">
              <p><span>Theater:</span> {showtime.theaterName}</p>
              <p><span>Start Time:</span> {formatDateTime(showtime.startTime)}</p>
              <p><span>End Time:</span> {formatDateTime(showtime.endTime)}</p>
            </div>
            <div className="showtime-actions">
              <Link to={`/showtimes/update/${showtime.id}`} className="button edit">Edit</Link>
              <button onClick={() => handleDelete(showtime.id)} className="button delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimesList;