import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import .meta.env.VITE_SHOWTIMES_SERVICE_URL || 'http://localhost:3003';
const MOVIES_API_URL = import.meta.env.VITE_MOVIES_SERVICE_URL || 'http://localhost:3001';

interface Movie {
  id: number;
  title: string;
}

interface Theater {
  id: number;
  name: string;
}

interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
}

const UpdateShowtimeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    price: '',
    startTime: '',
    startDate: '',
    endTime: '',
    endDate: ''
  });
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [showtimeRes, moviesRes, theatersRes] = await Promise.all([
          axios.get(`${API_URL}/showtimes/${id}`),
          axios.get(`${MOVIES_API_URL}/movies/all`),
          axios.get(`${API_URL}/theaters`)
        ]);
        
        const showtime: Showtime = showtimeRes.data;
        const startDateTime = new Date(showtime.startTime);
        const endDateTime = new Date(showtime.endTime);
        
        const formatDateForInput = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        const formatTimeForInput = (date: Date) => {
          return date.toTimeString().split(' ')[0].substring(0, 5);
        };
        
        setFormData({
          movieId: showtime.movieId.toString(),
          theaterId: showtime.theaterId.toString(),
          price: showtime.price.toString(),
          startDate: formatDateForInput(startDateTime),
          startTime: formatTimeForInput(startDateTime),
          endDate: formatDateForInput(endDateTime),
          endTime: formatTimeForInput(endDateTime)
        });
        
        setMovies(moviesRes.data);
        setTheaters(theatersRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load showtime data. Please try again.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        setSubmitting(false);
        return;
      }
      
      const payload = {
        movieId: parseInt(formData.movieId),
        theaterId: parseInt(formData.theaterId),
        price: parseFloat(formData.price),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };
      
      await axios.put(`${API_URL}/showtimes/update/${id}`, payload);
      navigate('/showtimes');
    } catch (err) {
      setError('Failed to update showtime. Please check your input and try again.');
      setSubmitting(false);
      console.error('Error updating showtime:', err);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading showtime data...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Update Showtime</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="theater-form">
        <div className="form-group">
          <label htmlFor="movieId">Movie</label>
          <select
            id="movieId"
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            className="form-control"
            required
          >
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="theaterId">Theater</label>
          <select
            id="theaterId"
            name="theaterId"
            value={formData.theaterId}
            onChange={handleChange}
            className="form-control"
            required
          >
            {theaters.map(theater => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Ticket Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            placeholder="10.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="datetime-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        
        <div className="datetime-row">
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="button cancel-btn" 
            onClick={() => navigate('/showtimes')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="button submit-btn" 
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Showtime'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateShowtimeForm;