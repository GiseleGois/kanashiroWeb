import React, { useEffect, useRef, useState } from 'react';
import { Edit } from 'react-feather';
import { useHistory } from 'react-router-dom';
import './style.css';
import { getAllOverdueInvoices } from '../../service';

function CheckInvoices() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const openModal = (invoiceData) => {
    setSelectedInvoice(invoiceData);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  useEffect(() => {
    getAllOverdueInvoices()
      .then(response => {
        console.log(response);
        setInvoiceData(response.unpaidInvoicesByUser);
      })
      .catch(error => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  return (
    <div className="checkInvoices-container">
      <h1>Pagamentos em atraso</h1>
      <div className="invoice-manager-list">
        {Object.entries(invoiceData).map(([userEmail, invoices]) => (
          <div key={userEmail}>
            <h2>{userEmail}</h2>
            {invoices.map(invoice => (
              <div
                className="invoice-manager-card"
                key={invoice.invoiceId}
                onClick={() => openModal(invoice)}
              >
                <p>Invoice ID: {invoice.invoiceId}</p>
                <p>Value: {invoice.value}</p>
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
      {selectedInvoice && (
        <div className="management-invoice-modal">
          <div className="invoice-manager-modal-content">
            <span className="close-icon" onClick={closeModal}>
              <Edit />
            </span>
            <h2>{selectedInvoice.username}</h2>
            {selectedInvoice.invoices.map(invoiceDetail => (
              <div key={invoiceDetail.invoiceId}>
                <p>Invoice ID: {invoiceDetail.invoiceId}</p>
                <p>Value: {invoiceDetail.value}</p>
                <p>Status: {invoiceDetail.status}</p>
                <p>Date: {invoiceDetail.date}</p>
              </div>
            ))}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );

}

export default CheckInvoices;
