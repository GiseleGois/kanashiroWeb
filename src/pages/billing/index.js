import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { ordersThisWeek, closeInvoice, checkUserPermission } from '../../service';

function Billing() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      } else {
        checkUserPermission(user.uid)
          .then((response) => {
            if (response.hasAccess === true) {
              setHasAccess(true);
              handleGetOrders();
            } else {
              setHasAccess(false);
            }
          })
          .catch((error) => {
            console.error('Error checking user permission:', error);
            history.push('/home');
            setHasAccess(false);
          });
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

  useEffect(() => {
    filterOrdersByUser();

  }, [orders, searchUser]);

  const handleGetOrders = () => {
    setIsLoading(true);

    ordersThisWeek()
      .then((response) => {
        if (Array.isArray(response)) {
          setOrders(response);
          const names = response.map((order) => order.username);
          setUsernames([...new Set(names)]);
        } else if (response.message === 'Não há pedidos nos últimos 7 dias.') {
          setOrders([]);
          setUsernames([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleShowOrderDetail = (orderId) => {
    history.push('/billing-detail', { orderId: orderId });
  };

  const handleCloseInvoice = (filteredOrders) => {
    setIsLoading(true);

    closeInvoice(filteredOrders)
      .then((userInvoices) => {
        const createdInvoiceId = userInvoices.message;
        setInvoices(createdInvoiceId);
        history.push('/invoice', { invoiceId: createdInvoiceId });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const filterOrdersByUser = () => {
    const filtered = orders.filter((order) => {
      return (
        order.username.toLowerCase().includes(searchUser.toLowerCase()) ||
        order.username.toLowerCase().includes(searchUser.toLowerCase())
      );
    });
    setFilteredOrders(filtered);

    setIsClientSelected(!!searchUser);
  };

  return (
    <div className="container">
      <div className="table-card">
        <h1 className="title">Pedidos feitos durante esta semana</h1>
        <div>
          <select value={searchUser} onChange={(e) => setSearchUser(e.target.value)}>
            <option value="">Selecione um usuário</option>
            {usernames.map((username) => (
              <option key={username} value={username}>
                {username}
              </option>
            ))}
          </select>
          <button onClick={filterOrdersByUser}>Pesquisar</button>
        </div>
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
        ) : (
          filteredOrders.length === 0 ? (
            <div>Não há nenhum pedido nos últimos 7 dias a ser exibido.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Usuário e local</th>
                  <th>Pedido</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Detalhe</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.userFullName}</td>
                    <td>{order.orderId}</td>
                    <td>{parseFloat(order.total).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                    <td>{order.createdAt}</td>
                    <td>
                      <button className="view-button" onClick={() => handleShowOrderDetail(order.orderId)}>
                        Visualizar pedido
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        {isClientSelected && (
          <button className="close-button" onClick={() => handleCloseInvoice(filteredOrders)}>
            Fechar fatura
          </button>
        )}
      </div>
    </div>
  )
}

export default Billing;
