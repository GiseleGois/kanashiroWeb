import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { getInvoicesByInvoiceId, getUserData, sendInvoiceToUser } from '../../service';

function CloseInvoice() {
  const history = useHistory();
  const location = useLocation();
  const invoiceId = location.state.invoiceId;

  const [invoice, setInvoice] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      } else {
        handleGetInvoices();
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

  const handleGetInvoices = () => {
    setIsLoading(true);

    if (!invoiceId) {
      history.push('/billing');
      return;
    }

    getInvoicesByInvoiceId(invoiceId)
      .then((userInvoices) => {
        setInvoice(userInvoices);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoBackToBillingPage = () => {
    history.push('/billing');
  };

  const handleGetUserData = (userId) => {
    if (!userId) {
      history.push('/billing');
      return;
    }

    getUserData(userId)
      .then((user) => {
        setUserData(user);
        handleSendInvoice(user[0].phone, user[0].name);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGetUser = () => {
    if (!invoice.length) {
      history.push('/billing');
      return;
    }

    setShowModal(true);
  };

  const handleConfirmSendInvoice = () => {
    setShowModal(false);

    handleGetUserData(invoice[0].userId);
  };

  const handleSendInvoice = (phone, name) => {
    setIsSendingInvoice(true);

    const invoiceData = {
      nome: name,
      date: invoice[0].date,
      total: parseFloat(invoice[0].total).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      status: invoice[0].status,
    };

    sendInvoiceToUser(phone, invoiceData)
      .then(() => {
        alert('A cobrança foi enviada');
        setIsSendingInvoice(false);
        history.push('/billing');
      })
      .catch((error) => {
        setIsSendingInvoice(false);
        console.error('Error sending invoice:', error);
      });
  };


  return (
    <div className="container">
      <div className="content">
        <div className="detail-table-card">
          <h1 className="title">Fechamento de fatura</h1>
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : invoice.length === 0 ? (
            <div>Não há nenhum dado a ser exibido</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fatura</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {invoice.map((item) => (
                  <tr key={item.invoiceId}>
                    <td>{item.username}</td>
                    <td>{item.invoiceId}</td>
                    <td>{item.date}</td>
                    <td>{item.status}</td>
                    <td>{parseFloat(item.total).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="buttons-container">
          <button className="back-to-billing-btn" onClick={handleGoBackToBillingPage}>
            Voltar
          </button>
          <button className="close-invoice-btn" onClick={handleGetUser}>
            {isSendingInvoice ? 'Enviando...' : 'Enviar cobrança da fatura'}
          </button>
        </div>
      </div>

      {/* Modal Component */}
      {showModal && (
        <div className="modal-invoice">
          <div className="modal-content-invoice">
            <h2>Deseja enviar a cobrança da fatura?</h2>
            <div className="modal-buttons-invoice">
              <div className="btn-cancel-send-invoice">
                <button onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
              <div className="btn-send-invoice-yes">
                <button onClick={handleConfirmSendInvoice}>Sim</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CloseInvoice;
