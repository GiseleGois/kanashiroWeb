import React from 'react';
import { useHistory } from 'react-router-dom';
import { Droplet, File } from 'react-feather';
import './style.css';

function Orders() {
  const history = useHistory();

  const handleShowPasteisClick = () => {
    history.push('/show-orders-of-pasteis');
  };

  const handleShowOthersClick = () => {
    history.push('/show-orders-of-others');
  };

  return (
    <div className="orders-container">
      <div>
        <div>
          <File />
          <button onClick={handleShowPasteisClick}>Exibir pedidos de pasteis</button>
        </div>
        <div>
          <Droplet />
          <button onClick={handleShowOthersClick}>Exibir pedidos de salgados</button>
        </div>
      </div>
    </div>
  );

}

export default Orders;
