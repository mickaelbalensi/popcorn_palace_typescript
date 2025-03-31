import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3001/movies";

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/all`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setMovies(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMovie = async (title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await fetch(`${API_URL}/${encodeURIComponent(title)}`, { 
          method: "DELETE" 
        });
        
        if (!res.ok) {
          throw new Error(`Failed to delete: ${res.status}`);
        }
        
        // Show success message
        alert(`"${title}" has been deleted successfully`);
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert(`Failed to delete "${title}". Please try again.`);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading movies...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="movies-container">
      <h2>All Movies</h2>
      
      {movies.length === 0 ? (
        <div className="no-movies">
          <p>No movies found. Add your first movie!</p>
          <Link to="/add" className="button add-first">Add Movie</Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id || movie.title} className="movie-card">
              <div className="movie-header">
                <h3>{movie.title}</h3>
                <span className="movie-rating">{movie.rating}/10</span>
              </div>
              
              <div className="movie-details">
                <p><span>Genre:</span> {movie.genre}</p>
                <p><span>Duration:</span> {movie.duration} min</p>
                <p><span>Release Year:</span> {movie.releaseYear}</p>
              </div>
              
              <div className="movie-actions">
                <Link 
                  to={`/update?title=${encodeURIComponent(movie.title)}`} 
                  className="button edit"
                >
                  Edit
                </Link>
                <button
                  className="button delete"
                  onClick={() => deleteMovie(movie.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;