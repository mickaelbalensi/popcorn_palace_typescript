// src/components/booking/SeatSelector.tsx
import React, { useState, useEffect } from 'react';

interface SeatSelectorProps {
  availableSeats: number[];
  selectedSeat: number | null;
  onSeatSelect: (seatNumber: number) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ 
  availableSeats, 
  selectedSeat, 
  onSeatSelect 
}) => {
  // Assuming a theater with 10 rows and 8 seats per row (adjust as needed)
  const rows = 10;
  const seatsPerRow = 8;
  const totalSeats = rows * seatsPerRow;
  
  // Create array of all possible seats
  const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Select a Seat</h3>
      
      <div className="mb-4 p-2 bg-gray-200 text-center rounded">Screen</div>
      
      <div className="grid grid-cols-8 gap-2">
        {allSeats.map((seatNumber) => {
          const isAvailable = availableSeats.includes(seatNumber);
          const isSelected = selectedSeat === seatNumber;
          
          return (
            <button
              key={seatNumber}
              onClick={() => isAvailable && onSeatSelect(seatNumber)}
              disabled={!isAvailable}
              className={`
                p-2 rounded-md text-center
                ${isSelected ? 'bg-green-500 text-white' : ''}
                ${!isAvailable ? 'bg-red-300 text-gray-600 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'}
              `}
              aria-label={`Seat ${seatNumber}`}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-4 text-sm">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-blue-100 mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-300 mr-1"></div>
          <span>Taken</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;