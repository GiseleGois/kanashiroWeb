import React, { useEffect, useState } from 'react';
import { Edit } from 'react-feather';
import Modal from '../../commons/modal/optionsModal';
import './style.css';
import { getAllOverdueInvoices } from '../../service';

function CheckInvoices() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  const openModal = (invoiceData) => {
    setSelectedInvoice(invoiceData);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  useEffect(() => {
    getAllOverdueInvoices()
      .then(response => {
        setInvoiceData(response.unpaidInvoicesByUser);
        setLoading(false); // Marcar o carregamento como concluído
      })
      .catch(error => {
        console.error("Error fetching invoices:", error);
        setLoading(false); // Marcar o carregamento como concluído mesmo em caso de erro
      });
  }, []);

  return (
    <div className="checkInvoices-container">
      <h1>Pagamentos em atraso</h1>
      {loading && <p>Carregando...</p>} {/* Indicador de carregamento */}
      {!loading && (
        <div className="invoice-manager-list">
          {Object.entries(invoiceData).map(([userEmail, invoices]) => (
            <div key={userEmail} className="user-invoices-container">
              {invoices.map((invoice, index) => (
                <div
                  className={`invoice-manager-card ${isHovered === index ? 'hovered' : ''}`}
                  key={invoice.invoiceId}
                  onClick={() => openModal(invoice)}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  style={{ zIndex: invoices.length - index }}
                >
                  <p>Usuario: {invoice.username}</p>
                  <p>Invoice ID: {invoice.invoiceId}</p>
                  <p>Value: {parseFloat(invoice.value).toFixed(2)}</p>
                  <p>Status: {invoice.status}</p>
                  <p>Date: {invoice.date}</p>
                  <span className="edit-icon">
                    <Edit />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {selectedInvoice && (
        <Modal onClose={closeModal} invoiceData={selectedInvoice}>
          <div className="invoice-manager-modal-content">
            <span className="close-icon" onClick={closeModal}>
              <Edit />
            </span>
            {selectedInvoice && (
              <div key={selectedInvoice.invoiceId}>
                <p>Username: {selectedInvoice.username}</p>
                <p>Invoice ID: {selectedInvoice.invoiceId}</p>
                <p>Value: {parseFloat(selectedInvoice.value).toFixed(2)}</p>
                <p>Status: {selectedInvoice.status}</p>
                <p>Date: {selectedInvoice.date}</p>
              </div>
            )}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CheckInvoices;
