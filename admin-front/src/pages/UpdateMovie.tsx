import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import .meta.env.VITE_SHOWTIMES_SERVICE_URL || 'http://localhost:3003';

function UpdateMovie() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get("title");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseYear: ""
  });

  useEffect(() => {
    if (!movieTitle) {
      fetchAllMovieTitles();
      setIsLoading(false);
    } else {
      fetchMovieDetails(movieTitle);
    }
  }, [movieTitle]);

  const [allMovies, setAllMovies] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  const fetchAllMovieTitles = async () => {
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }
      const movies = await response.json();
      setAllMovies(movies);
    } catch (error) {
      console.error("Error fetching movie titles:", error);
      setError("Failed to load movies. Please try again.");
    }
  };

  const fetchMovieDetails = async (title) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }
      const movies = await response.json();
      const movie = movies.find(m => m.title === title);
      
      if (movie) {
        setFormData({
          title: movie.title || "",
          genre: movie.genre || "",
          duration: movie.duration || "",
          rating: movie.rating || "",
          releaseYear: movie.releaseYear || ""
        });
        setError(null);
      } else {
        setError(`Movie "${title}" not found`);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError(`Failed to load movie details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleSelect = (e) => {
    const title = e.target.value;
    setSelectedTitle(title);
    if (title) {
      navigate(`/update?title=${encodeURIComponent(title)}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const originalTitle = movieTitle;
      const response = await fetch(`${API_URL}/update/${encodeURIComponent(originalTitle)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update movie: ${response.status}`);
      }

      alert("Movie updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating movie:", error);
      alert(`Failed to update movie: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && movieTitle) {
    return <div className="loading-spinner">Loading movie details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Update Movie</h2>
      
      {!movieTitle && (
        <div className="form-group">
          <label htmlFor="movieSelect">Select Movie to Update</label>
          <select
            id="movieSelect"
            className="form-control"
            value={selectedTitle}
            onChange={handleTitleSelect}
          >
            <option value="">-- Select a Movie --</option>
            {allMovies.map(movie => (
              <option key={movie.id || movie.title} value={movie.title}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {movieTitle && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              className="form-control"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-10)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              className="form-control"
              value={formData.rating}
              onChange={handleChange}
              required
              min="1"
              max="10"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseYear">Release Year</label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              className="form-control"
              value={formData.releaseYear}
              onChange={handleChange}
              required
              min="1900"
              max="2099"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="button" 
              onClick={() => navigate("/")}
              style={{ backgroundColor: "#7f8c8d", marginRight: "1rem" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? "Updating..." : "Update Movie"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpdateMovie;