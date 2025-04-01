// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './components/auth/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ShowtimesPage from './pages/ShowtimesPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingPage';
import BookingConfirmation from './components/booking/BookingConfirmation';

const App: React.FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/showtimes" element={<ShowtimesPage />} />
              <Route path="/booking/:showtimeId" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;