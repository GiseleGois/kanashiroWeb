import React from 'react';
import { useHistory } from 'react-router-dom';
import { Droplet, File, Home, Package } from 'react-feather';
import './style.css';

function Orders() {
  const history = useHistory();

  const handleShowPasteisClick = () => {
    history.push('/show-orders-of-pasteis');
  };

  const handleShowOthersClick = () => {
    history.push('/show-orders-of-others');
  };

  const handleShowRetro = () => {
    history.push('/retro');
  };

  const handleBackToHome = () => {
    history.push('/home');
  };

  return (
    <div className="orders-container">
      <div className="button-container">
        <div className="button">
          <File />
          <button onClick={handleShowPasteisClick}>Exibir pedidos de pasteis</button>
        </div>
        <div className="button">
          <Droplet />
          <button onClick={handleShowOthersClick}>Exibir pedidos de salgados</button>
        </div>
        <div className="button">
          <Home />
          <button onClick={handleBackToHome}>Pagina Inicial</button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
