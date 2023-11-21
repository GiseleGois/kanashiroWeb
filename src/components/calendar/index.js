import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

function Calendar({ onDateChange, onSearch }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const datePickerRef = useRef(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      onDateChange(start, end);
    }
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
  };

  return (
    <div className="calendar-container">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        ref={datePickerRef}
      />
      {startDate && endDate && (
        <button type="button" onClick={handleClearDate} className="clear-button">
          Limpar
        </button>
      )}
            {startDate && endDate && (
        <button type="button" onClick={onSearch} className="search-button">
          Pesquisar
        </button>
      )}
    </div>
  );
}

export default Calendar;
