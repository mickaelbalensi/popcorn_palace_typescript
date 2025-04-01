// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../components/auth/UserContext';

const HomePage: React.FC = () => {
  const { isLoggedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col justify-center items-center text-white text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Movie Booking</h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Book your favorite movies with ease and enjoy the best cinema experience!
      </p>
      
      {isLoggedIn ? (
        <div className="space-y-4">
          <Link
            to="/showtimes"
            className="inline-block bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            View Showtimes
          </Link>
          <Link
            to="/my-bookings"
            className="block text-white hover:text-blue-200 font-medium"
          >
            My Bookings
          </Link>
        </div>
      ) : (
        <Link
          to="/login"
          className="inline-block bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg"
        >
          Get Started
        </Link>
      )}
    </div>
  );
};

export default HomePage;