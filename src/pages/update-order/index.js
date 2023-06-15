import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import moment from 'moment';
import Select from 'react-select';
import listOrdersById from '../../service/listOrdersById';
// import updateOrder from '../../service/updateOrder';
import listServices from '../../service/getServices';

export default function UpdateOrder() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showSection, setShowSection] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [newItem, setNewItem] = useState({ selectedService: null, quantity: '' });
  const [showNewInput, setShowNewInput] = useState(false);
  const [services, setServices] = useState([]);
  const datePickerRef = useRef(null);
  const selectRef = useRef(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setShowSection(false);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    datePickerRef.current.setOpen(true);
  };

  const handleSearchDate = () => {
    setShowSection(true);
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setOrderItems(order.items);
    setEditMode(false);
    setShowModal(true);
    if (selectRef.current) {
      selectRef.current.focus();
    }
  };

  const handleEditOrder = (orderId) => {
    console.log(orderId)
    setEditMode(true);
    setShowNewInput(true);
    // updateOrder(orderId);
  };

  const handleAddItem = () => {
    setOrderItems((prevItems) => [...prevItems, newItem]);
    setNewItem({ product: '', quantity: '' });
  };

  const handleRemoveItem = () => {
    alert('Essa função ainda não esta disponivel');
  };

  const handleServiceChange = (selectedOption) => {
    setNewItem({ ...newItem, selectedService: selectedOption });
  };

  useEffect(() => {
    if (startDate && endDate) {
      const startOfDay = moment(startDate).startOf('day');
      const endOfDay = moment(endDate).endOf('day');
      console.log(startOfDay);
      console.log(endOfDay);

      setIsLoading(true);
      listOrdersById()
        .then((response) => {
          const filteredOrders = response.data.filter((order) => {
            const orderDate = moment(order.createAt);
            console.log(orderDate);
            return orderDate.isBetween(startOfDay, endOfDay, null, '[]');
          });
          setOrders(filteredOrders);
        })
        .catch((error) => {
          console.log('Error:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    listServices()
      .then(response => {
        setServices(response);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);

  return (
    <div className='update-order-container'>
      <div className='search-date'>
        <p>Selecione a data inicial e final para visualizar os pedidos</p>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          ref={datePickerRef}
        />
        {startDate && endDate && (
          <button type='button' onClick={handleClearDate} className='clear-button'>
            Limpar
          </button>
        )}
        {startDate && endDate && (
          <button type='button' onClick={handleSearchDate} className='search-button'>
            Pesquisar
          </button>
        )}
      </div>

      {showSection && startDate && endDate && (
        <section id="servicos" className="servicos">
          <h1 className="servicos-title">Pedidos</h1>
          <div className="servicos-cards">
            {isLoading ? (
              <div class="spinner">
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
            ) : orders.length === 0 ? (
              <div>Não há nenhum pedido a ser exibido</div>
            ) : (
              orders.map((order) => (
                <div className="card" key={order.orderId}>
                  <div className="card-content">
                    <h3>{order.userFullName}</h3>
                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <p key={index}>
                          {item.product} x: {item.quantity}<br />
                        </p>
                      ))}
                    </div>
                    <button onClick={() => handleShowModal(order)}>{order.buttonText}Exibir mais detalhes</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {showModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalhes do Pedido</h2>
            <h3>{selectedOrder.userFullName}</h3>
            <div className="items-list">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    {editMode && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      {editMode && (
                        <td>
                          <button onClick={() => handleRemoveItem()} className="remove-item">Remover</button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {editMode && showNewInput && (
                    <tr>
                      <td>
                        <Select
                          className='input-add-item menu-portal'
                          value={newItem.selectedService}
                          onChange={handleServiceChange}
                          options={services.map(service => ({ value: service.id, label: service.type }))}
                          placeholder="Selecione um serviço..."
                          isSearchable
                          isClearable
                          ref={selectRef}
                          menuPlacement="top"
                          components={{
                            Option: props => (
                              <div
                                className={props.isFocused ? 'highlighted-option' : ''}
                                onMouseEnter={props.innerProps.onMouseEnter}
                                onMouseMove={props.innerProps.onMouseMove}
                                onClick={props.innerProps.onClick}
                              >
                                {props.label}
                              </div>
                            )
                          }}
                        />
                      </td>

                      <td>
                        <input
                          className='input-add-item'
                          type="text"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        />
                      </td>
                      <td>
                        <button onClick={handleAddItem} className="add-button">Adicionar novo item</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-buttons">
              <button className="edit-button" onClick={() => handleEditOrder(selectedOrder.orderId)}>
                Editar Pedido
              </button>
              <button onClick={() => setShowModal(false)} className="close-button">Fechar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
