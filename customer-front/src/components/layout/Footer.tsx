// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Movie Booking System</p>
        <p className="text-sm mt-2 text-gray-400">Book your favorite movies with ease!</p>
      </div>
    </footer>
  );
};

export default Footer;