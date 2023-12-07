import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Droplet, File, Home } from 'react-feather';
import Calendar from '../../components/calendar';
import './style.css';

function Orders() {
  const history = useHistory();
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

  const handleShowPasteisClick = () => {
    history.push('/retro-orders-of-pasteis', { start: selectedDates.start, end: selectedDates.end });
  };

  const handleShowOthersClick = () => {
    history.push('/retro-orders-of-others', { start: selectedDates.start, end: selectedDates.end });
  };

  const handleBackToHome = () => {
    history.push('/home');
  };

  const handleDateChange = (start, end) => {
    setSelectedDates({ start, end });
  };

  return (
    <div className="orders-container">
      <div className="button-container">
      <Calendar onDateChange={handleDateChange} />
        {selectedDates.start && selectedDates.end ? (
          <>
            <button className="button" onClick={handleShowPasteisClick}>Exibir pedidos de pasteis</button>
            <button className="button" onClick={handleShowOthersClick}>Exibir pedidos de salgados</button>
          </>
        ) : null}
        <div className="button">
          <Droplet />
          <button onClick={handleBackToHome}>Pagina Inicial</button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
