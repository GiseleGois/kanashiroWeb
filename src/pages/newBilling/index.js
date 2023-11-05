import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';
import { ordersThisWeek, closeInvoice } from '../../service';
import Calendar from '../../components/billingCalendar';
import Moment from 'moment';
import 'moment/locale/pt-br';

function NewBilling() {
  const history = useHistory();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [filterUsername, setFilterUsername] = useState('');
  const [usernameOptions, setUsernameOptions] = useState([]);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const originalOrderData = useRef([]);

  function formatTimestamp(timestamp) {
    return Moment.unix(timestamp).locale('pt-br').format('MMMM D, YYYY');
  }

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const orders = await ordersThisWeek(selectedStartDate, selectedEndDate);
        orders.forEach(order => {
          order.total = parseFloat(order.total).toFixed(2);
          order.schedule = formatTimestamp(order.scheduled._seconds);
        });
        setOrderData(orders);
        originalOrderData.current = orders;

        const uniqueUsernames = Array.from(
          new Set(orders.map(order => order.username))
        );
        setUsernameOptions(uniqueUsernames);
      } catch (error) {
        console.error('Erro ao buscar os pedidos da semana:', error);
      }
    }

    if (showTable) {
      loadOrders();
    }
  }, [showTable, selectedStartDate, selectedEndDate]);

  const handleDateChange = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setShowTable(false);
    setFilterUsername('');
  };

  const handleFilter = () => {
    const filteredOrders = originalOrderData.current.filter(
      order => order.username === filterUsername
    );
    setOrderData(filteredOrders);
    setIsUserSelected(!!filterUsername);
    setFilterUsername('');
  };

  const handleShowOrderDetail = (orderId) => {
    history.push('/billing-detail', { orderId: orderId });
  };

  const handleCloseInvoice = async (filteredOrders) => {
    setIsLoading(true);

    const invoice = await closeInvoice(filteredOrders)
    const createdInvoiceId = invoice.message;

    setInvoices(createdInvoiceId);
    history.push('/invoice', { invoiceId: createdInvoiceId });

    setIsLoading(false);

  };

  return (
    <div className="new-billing-container">
      {showTable ? (
        <div className="card-container">
          <div className="filter-container">
            <select
              value={filterUsername}
              onChange={e => setFilterUsername(e.target.value)}
            >
              <option value="">Selecione um nome de usuário</option>
              {usernameOptions.map(username => (
                <option key={username} value={username}>
                  {username}
                </option>
              ))}
            </select>
            <button className="filter-button" onClick={handleFilter}>Filtrar</button>
            <button className="calendar-button" onClick={handleDateChange}>Escolher outra data</button>
          </div>
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
              {orderData.map((order, index) => (
                <tr key={index}>
                  <td>{order.userFullName}</td>
                  <td>{order.orderId}</td>
                  <td>R$ {order.total}</td>
                  <td>{order.schedule}</td>
                  <td>
                    <button className="view-button" onClick={() => handleShowOrderDetail(order.orderId)}>
                      Visualizar pedido
                    </button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {isUserSelected && (
            <button
              className="close-invoice-button"
              onClick={() => handleCloseInvoice(orderData)}
            >
              Fechar fatura
            </button>
          )}
        </div>
      ) : (
        <Calendar onDateChange={handleDateChange} onSearch={() => setShowTable(true)} />
      )}
    </div>
  );
}

export default NewBilling;
