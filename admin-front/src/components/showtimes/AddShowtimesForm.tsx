import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MOVIES_API_URL = import.meta.env.VITE_MOVIES_SERVICE_URL || 'http://localhost:3001';
const THEATERS_API_URL = import.meta.env.VITE_THEATERS_SERVICE_URL || 'http://localhost:3002';
const API_URL = import .meta.env.VITE_SHOWTIMES_SERVICE_URL || 'http://localhost:3003';

interface Movie {
  id: number;
  title: string;
}

interface Theater {
  id: number;
  name: string;
}

const AddShowtimeForm: React.FC = () => {
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
    console.log('Fetching movies and theaters...');
    
    const fetchData = async () => {
      try {
        setLoading(true);

        const [moviesRes, theatersRes] = await Promise.all([
          axios.get(`${MOVIES_API_URL}/movies/all`),
          axios.get(`${THEATERS_API_URL}/theaters`)
        ]);

        console.log('Movies response:', moviesRes.data);
        console.log('Theaters response:', theatersRes.data);

        setMovies(moviesRes.data);
        setTheaters(theatersRes.data);

        if (moviesRes.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            movieId: moviesRes.data[0].id.toString()
          }));
        }

        if (theatersRes.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            theaterId: theatersRes.data[0].id.toString()
          }));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies and theaters:', err);
        setError('Failed to load movies and theaters.');
        setLoading(false);
      }
    };

    fetchData();

    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];
    const formatTimeForInput = (date: Date) => date.toTimeString().split(' ')[0].substring(0, 5);

    setFormData(prev => ({
      ...prev,
      startDate: formatDateForInput(now),
      startTime: formatTimeForInput(now),
      endDate: formatDateForInput(endTime),
      endTime: formatTimeForInput(endTime),
      price: '10.00'
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Updating form data: ${name} = ${value}`);
    
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

      console.log('Start DateTime:', startDateTime);
      console.log('End DateTime:', endDateTime);

      if (endDateTime <= startDateTime) {
        console.warn('End time must be after start time');
        setError('End time must be after start time');
        setSubmitting(false);
        return;
      }

      const selectedTheater = theaters.find(t => t.id === parseInt(formData.theaterId));

        if (!selectedTheater) {
            setError('Selected theater not found');
            setSubmitting(false);
            return;
        }

      const payload = {
        movieId: parseInt(formData.movieId),
        theater: selectedTheater.name,
        price: parseFloat(formData.price),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };

      console.log('Submitting showtime:', payload);

      const response = await axios.post(`${API_URL}/showtimes`, payload);
      console.log('Showtime created successfully:', response.data);

      navigate('/showtimes');
    } catch (err) {
      console.error('Error creating showtime:', err);
      setError('Failed to create showtime. Please check your input and try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading form...</div>;
  }

  if (movies.length === 0 || theaters.length === 0) {
    return (
      <div className="error-message">
        {movies.length === 0 && <p>You need to add movies before creating showtimes.</p>}
        {theaters.length === 0 && <p>You need to add theaters before creating showtimes.</p>}
        <div style={{ marginTop: '15px' }}>
          {movies.length === 0 && <a href="/movies/add" className="button edit">Add Movie</a>}
          {theaters.length === 0 && <a href="/theaters/add" className="button edit" style={{ marginLeft: '10px' }}>Add Theater</a>}
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Showtime</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="theater-form">
        <div className="form-group">
          <label htmlFor="movieId">Movie</label>
          <select id="movieId" name="movieId" value={formData.movieId} onChange={handleChange} className="form-control" required>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="theaterId">Theater</label>
          <select id="theaterId" name="theaterId" value={formData.theaterId} onChange={handleChange} className="form-control" required>
            {theaters.map(theater => (
              <option key={theater.id} value={theater.id}>{theater.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Ticket Price ($)</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-control" min="0" step="0.01" required />
        </div>

        <div className="datetime-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="datetime-row">
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button cancel-btn" onClick={() => navigate('/showtimes')}>Cancel</button>
          <button type="submit" className="button submit-btn" disabled={submitting}>{submitting ? 'Adding...' : 'Add Showtime'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddShowtimeForm;