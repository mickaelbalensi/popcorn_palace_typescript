// src/pages/theaters/UpdateTheaterPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddTheaterForm from '../../components/theaters/AddTheaterForm';

interface Theater {
  id: number;
  name: string;
  location: string;
  capacity: number;
  screenCount: number;
}

const UpdateTheaterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const response = await fetch(`http://localhost:3002/theaters/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch theater');
        }
        const data = await response.json();
        setTheater(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTheater();
  }, [id]);

  if (loading) return <div>Loading theater data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!theater) return <div>Theater not found</div>;

  return (
    <div className="update-theater-page">
      <AddTheaterForm 
        initialData={theater}
        theaterId={parseInt(id as string)}
        isUpdate={true}
      />
    </div>
  );
};

export default UpdateTheaterPage;