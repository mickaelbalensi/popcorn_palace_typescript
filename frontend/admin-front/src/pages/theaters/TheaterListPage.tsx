// src/pages/theaters/TheaterListPage.tsx
import React from 'react';
import TheaterList from '../../components/theaters/TheatersList';
import { Link } from 'react-router-dom';

const TheaterListPage: React.FC = () => {
  return (
    <div className="theater-list-page">
      <div className="page-header">
        <h1>Theater Management</h1>
        <Link to="/theaters/add" className="button add-movie">Add New Theater</Link>
      </div>
      <TheaterList />
    </div>
  );
};

export default TheaterListPage;