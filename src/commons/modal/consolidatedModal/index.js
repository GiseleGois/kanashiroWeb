import React from 'react';
import './style.css';

const Modal = ({ consolidatedData, onClose, showSuccessModal, successMessage, dateRange, weekData }) => {
  const totalDaSemanaObject = weekData.find(item => "Total da semana" in item);
  const totalDaSemana = totalDaSemanaObject ? totalDaSemanaObject["Total da semana"] : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

const renderContent = () => {
  if (showSuccessModal) {
    return <p>{successMessage}</p>;
  } else {
    return (
      <div>
        <p className="total-da-semana">Total da semana: {formatCurrency(Number(totalDaSemana))}</p>
        <div className="table-container-consolidated">
          <table className='table-consolidated'>
            <thead>
              <tr>
                <th>CreatedAt</th>
                <th>Username</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {weekData.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.createdAt ? new Date(invoice.createdAt._seconds * 1000).toLocaleString() : ''}</td>
                  <td>{invoice.username}</td>
                  <td>{formatCurrency(Number(invoice.total))}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className={`consolidated-modal ${showSuccessModal ? 'success-consolidated-modal' : ''}`}>
      <div className="consolidated-modal-content">
        {renderContent()}
        <button onClick={handleCloseModal} className="consolidated-modal-close-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
