import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/movies";

function AddMovie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseYear: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add movie: ${response.status}`);
      }

      alert("Movie added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding movie:", error);
      alert(`Failed to add movie: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Movie</h2>
      
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
            placeholder="Enter movie title"
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
            placeholder="e.g. Action, Comedy, Drama"
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
            placeholder="e.g. 120"
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
            placeholder="e.g. 8.5"
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
            placeholder="e.g. 2023"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Movie"}
        </button>
      </form>
    </div>
  );
}

export default AddMovie;