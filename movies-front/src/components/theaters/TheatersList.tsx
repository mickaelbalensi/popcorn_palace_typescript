// src/components/theaters/TheaterList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Theater {
  id: number;
  name: string;
  address: string;
  max_person: number;
}

const API_URL = "http://localhost:3002/theaters";

const TheaterList: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      setTheaters(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching theaters:", err);
      setError("Failed to load theaters. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete: ${response.status}`);
        }
        
        // Show success message
        alert(`"${name}" has been deleted successfully`);
        
        // Update the list without reloading
        setTheaters(theaters.filter(theater => theater.id !== id));
      } catch (err) {
        console.error("Error deleting theater:", err);
        alert(`Failed to delete "${name}". Please try again.`);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading theaters...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="movies-container">
      <h2>All Theaters</h2>
      
      {theaters.length === 0 ? (
        <div className="no-theaters">
          <p>No theaters found. Add your first theater!</p>
          <Link to="/theaters/add" className="button add-first">Add Theater</Link>
        </div>
      ) : (
        <div className="theater-grid">
          {theaters.map((theater) => (
            <div key={theater.id} className="theater-card">
              <div className="theater-header">
                <h3>{theater.name}</h3>
              </div>
              
              <div className="theater-details">
                <p><span>Address:</span> {theater.address} seats</p>
                <p><span>Capacity:</span> {theater.max_person} seats</p>
              </div>
              
              <div className="theater-actions">
                <Link 
                  to={`/theaters/update/${theater.id}`} 
                  className="button edit"
                >
                  Edit
                </Link>
                <button
                  className="button delete"
                  onClick={() => handleDelete(theater.id, theater.name)}
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
};

export default TheaterList;