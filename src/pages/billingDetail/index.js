import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import { auth } from '../../firebase';
import './style.css';
import { fetchOrderById, checkUserPermission } from '../../service';

function BillingDetail() {
  const history = useHistory();
  const location = useLocation();
  const orderId = location.state.orderId;

  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      checkUserPermission(user.uid)
        .then((response) => {
          if (response.hasAccess === true) {
            setHasAccess(true);
            handleGetOrder();
          } else {
            setHasAccess(false);
          }
        })
        .catch((error) => {
          console.error('Error checking user permission:', error);
          history.push('/home');
          setHasAccess(false);
        });
    });

    return () => unsubscribeAuth();
  }, [history]);

  const handleGetOrder = () => {
    setIsLoading(true);

    if (!orderId) {
      history.push('/billing');
      return;
    }

    fetchOrderById(orderId)
      .then((detailOrder) => {
        setOrder(detailOrder);

        const sum = detailOrder.reduce((acc, item) => acc + item.total, 0).toFixed(2);
        setTotalValue(sum);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoBackToBillingPage = () => {
    history.push('/billing');
  };

  const downloadCSV = () => {
    const csvHeaders = ['Tipo', 'Preço', 'Quantidade', 'Valor'];
    const csvRows = order.map((item) => [item.type, item.value, item.quantity, item.total]);

    const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', 'order_details.csv');
    link.click();
  };

  return (
    <div className="detail-container">
      <div className="content">
        <div className="detail-table-card">
          <h1 className="title">Detalhamento da fatura</h1>
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
          ) : order.length === 0 ? (
            <div>Não há nenhum dado a ser exibido</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.type}>
                    <td>{item.type}</td>
                    <td>{item.value}</td>
                    <td>{item.quantity}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3">Total</td>
                  <td>R$: {totalValue}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="buttons-container">
          <button className="download-btn" onClick={downloadCSV}>
            Baixar
            <FiDownload className="download-icon" />
          </button>
          <button className="close-btn" onClick={() => handleGoBackToBillingPage()}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingDetail;
