// src/components/theaters/AddTheaterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TheaterFormData {
  name: string;
  address: string;
  max_person: number;
}

interface AddTheaterFormProps {
  initialData?: TheaterFormData;
  theaterId?: number;
  isUpdate?: boolean;
}

const API_URL = "http://localhost:3002/theaters";

const AddTheaterForm: React.FC<AddTheaterFormProps> = ({ 
  initialData = { name: '', address: '', max_person: 0 },
  theaterId,
  isUpdate = false
}) => {
  const [formData, setFormData] = useState<TheaterFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' || name === 'screenCount' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isUpdate
        ? `${API_URL}/${theaterId}`
        : API_URL;
      
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} theater`);
      }

      // Show success message
      alert(`Theater "${formData.name}" has been ${isUpdate ? 'updated' : 'added'} successfully!`);
      
      navigate('/theaters');
    } catch (err) {
      console.error("Error submitting theater:", err);
      setError(`Failed to ${isUpdate ? 'update' : 'add'} theater. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{isUpdate ? 'Update Theater' : 'Add New Theater'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="theater-form">
        <div className="form-group">
          <label htmlFor="name">Theater Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter theater name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter theater name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="max_person">Max Person</label>
          <input
            type="number"
            id="max_person"
            name="max_person"
            value={formData.max_person}
            className="form-control"
            onChange={handleInputChange}
            required
            min="1"
            placeholder="Enter seating capacity"
          />
        </div>
        
        
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="button submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isUpdate ? 'Update Theater' : 'Add Theater'}
          </button>
          <button 
            type="button" 
            className="button cancel-btn"
            onClick={() => navigate('/theaters')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTheaterForm;