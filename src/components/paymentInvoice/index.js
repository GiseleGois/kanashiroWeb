import React, { useState, useEffect } from 'react';
import './style.css';
import { paymentInvoice } from '../../service';
import Modal from '../../commons/modal/genericModal';
import { useHistory } from 'react-router-dom';

function PaymentInvoice(props) {
  const { location } = props;
  const { state } = location;
  const { invoiceData } = state || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);
  const [partialPayment, setPartialPayment] = useState('');
  const history = useHistory();

  const invoiceId = invoiceData?.invoiceId;

const handleUpdateButtonClick = async () => {
  try {
    const numericPartialPayment = parseFloat(partialPayment);
    const response = await paymentInvoice(invoiceId, numericPartialPayment);
    setModalMessage(response.message);
    setModalVisible(true);
  } catch (error) {
    console.error("Error updating invoice:", error);
    setModalMessage('Error updating the invoice. Please try again.');
    setModalVisible(true);
  }
};

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    <div className="paymentInvoice-container">
      <div className="paymentInvoice-card">
        <h1 className="invoice-title">Pagar valor parcial da fatura</h1>
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
          <strong>Total:</strong> R$: {formatCurrency(invoiceData?.value)}
        </div>

        <div className="invoice-info">
          <label htmlFor="partialPayment">Valor Parcial:</label>
          <input
            type="number"
            id="partialPayment"
            value={partialPayment}
            onChange={(e) => setPartialPayment(parseFloat(e.target.value))}
          />
        </div>

        <button className="update-button" onClick={handleUpdateButtonClick}>
          Atualizar Status da Fatura
        </button>
      </div>

      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
}

export default PaymentInvoice;
