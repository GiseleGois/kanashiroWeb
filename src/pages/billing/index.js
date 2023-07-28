import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { getOrdersById, closeInvoice } from '../../service';

function Billing() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [isClientSelected, setIsClientSelected] = useState(false); // New state to track client selection

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      } else {
        handleGetOrders();
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

  useEffect(() => {
    filterOrdersByUser();
  }, [orders, searchUser]);

  const handleGetOrders = () => {
    setIsLoading(true);

    getOrdersById()
      .then((userOrders) => {
        setOrders(userOrders);
        const names = userOrders.map((order) => order.username);
        setUsernames([...new Set(names)]);
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

    // Check if a client is selected and update the state accordingly
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
        ) : filteredOrders.length === 0 ? (
          <div>Não há nenhum pedido a ser exibido</div>
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
                  <td>{order.total}</td>
                  <td>{order.createAt}</td>
                  <td>
                    <button className="view-button" onClick={() => handleShowOrderDetail(order.orderId)}>
                      Visualizar pedido
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Conditionally render the "Fechar fatura" button */}
        {isClientSelected && (
          <button className="close-button" onClick={() => handleCloseInvoice(filteredOrders)}>
            Fechar fatura
          </button>
        )}
      </div>
    </div>
  );
}

export default Billing;
