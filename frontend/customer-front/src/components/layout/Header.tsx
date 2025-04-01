// src/components/layout/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../auth/UserContext';

const Header: React.FC = () => {
  const { user, setUser, isLoggedIn } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Movie Booking
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/showtimes" className="hover:text-blue-200">
                    Showtimes
                  </Link>
                </li>
                <li>
                  <Link to="/my-bookings" className="hover:text-blue-200">
                    My Bookings
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mr-4">
                    Hi, {user?.firstName}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded font-medium"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;