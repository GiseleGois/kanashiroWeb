import React, { useState, useEffect } from 'react';
import './style.css';
import { updateInvoiceStatus } from '../../service';
import Modal from '../../commons/modal/genericModal';
import { useHistory } from 'react-router-dom';

function UpdateInvoice(props) {
  const { location } = props;
  const { state } = location;
  const { invoiceData } = state || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);
  const history = useHistory();

  const paid = true;
  const invoiceId = invoiceData?.invoiceId;

  const handleUpdateButtonClick = async () => {
    try {
      const response = await updateInvoiceStatus(invoiceId, paid);
      setModalMessage(response.message);
      setModalVisible(true);
    } catch (error) {
      console.error("Error updating invoice:", error);
      setModalMessage('Error updating the invoice. Please try again.');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setUpdateClicked(true);
  };

  useEffect(() => {
    if (updateClicked && !modalVisible) {
      history.push('/check-invoices');
    }
  }, [updateClicked, modalVisible, history]);

  return (
    <div className="updateInvoice-container">
      <div className="updateInvoice-card">
        <h1 className="invoice-title">Detalhes da Fatura</h1>
        <div className="invoice-info">
          <strong>Usuário:</strong> {invoiceData?.username}
        </div>
        <div className="invoice-info">
          <strong>Fatura:</strong> {invoiceData?.invoiceId}
        </div>
        <div className="invoice-info">
          <strong>Status:</strong> {invoiceData?.status}
        </div>
        <div className="invoice-info">
          <strong>Data de fechamento:</strong> {invoiceData?.date}
        </div>
        <div className="invoice-info">
          <strong>Total:</strong> R$: {invoiceData?.value}
        </div>
        <button className="update-button" onClick={handleUpdateButtonClick}>
          Atualizar Status da Fatura
        </button>
      </div>

      {modalVisible && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
}

export default UpdateInvoice;
