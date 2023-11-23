import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';

const Modal = ({ invoiceData, message, onClose, showSuccessModal, successMessage }) => {
  const history = useHistory();

  const handlePaymentTotal = () => {
    console.log('invoice', invoiceData);
    history.push({
      pathname: '/update',
      state: { invoiceData: invoiceData },
    });
  };

  const handlePaymentPartial = () => {
    history.push({
      pathname: '/payment',
      state: { invoiceData: invoiceData },
    });
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className={`modal ${showSuccessModal ? 'success-modal' : ''}`}>
      <div className="modal-content">
        {showSuccessModal ? (
          <p>{successMessage}</p>
        ) : (
          <>
            <p>{message}</p>
            <h2>Pagamento de fatura</h2>
            <div className="payment-options">
              <button onClick={handlePaymentTotal}>Alterar status da fatura</button>
              <button onClick={handlePaymentPartial}>Pagamento parcial do valor devido</button>
            </div>
          </>
        )}
        <button onClick={handleCloseModal} className="modal-close-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
