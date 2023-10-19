import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import Select from 'react-select';
import { listOrders, removeItem, insertItem, listProductsToUpdateOrders, checkUserPermission } from '../../service';

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
  const [quantityMissing, setQuantityMissing] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      checkUserPermission(user.uid)
        .then((response) => {
          if (response.hasAccess === true) {
            setHasAccess(true);
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

  const handleEditOrder = async () => {
    setEditMode(true);
    setShowNewInput(true);
    await fetchUpdatedOrderData(startDate, endDate);
  };

  const fetchUpdatedOrderData = async (startDate, endDate) => {
    setIsLoading(true);
    try {
      const response = await listOrders(startDate, endDate);
      setOrders(response);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (productId, orderId, quantity) => {
    if (!productId || !orderId || !quantity) {
      setQuantityMissing(true);
      return;
    }

    setQuantityMissing(false);
    setOrderItems((prevItems) => [...prevItems, { product: productId, quantity }]);
    setNewItem({ selectedService: null, quantity: '' });

    await insertItem(orderId, productId, quantity);
    fetchUpdatedOrderData(startDate, endDate); // Fetch updated order data
  };

  const handleRemoveItem = async (productId, orderId) => {
    const indexToRemove = selectedOrder.items.findIndex(item => item.product === productId);

    if (indexToRemove !== -1) {
      const updatedItems = [...selectedOrder.items];
      const removedItem = updatedItems.splice(indexToRemove, 1)[0];

      setOrderItems(removedItem.productId);
      await removeItem(orderId, removedItem.productId);

      fetchUpdatedOrderData(startDate, endDate);
    }
  };

  const handleServiceChange = (selectedOption) => {
    setNewItem({ ...newItem, selectedService: selectedOption });
  };

  useEffect(() => {
    if (startDate && endDate) {
      setIsLoading(true);
      listOrders(startDate, endDate)
        .then((response) => {
          setOrders(response);
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
    listProductsToUpdateOrders()
      .then(response => {
        setServices(response);
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
                          <button onClick={() => handleRemoveItem(item.product, selectedOrder.orderId)} className="remove-item">Remover</button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {editMode && showNewInput && (
                    <tr>
                      <td colSpan={editMode ? 3 : 2}>
                        <div className="input-container">
                          <Select
                            className='input-add-item menu-portal'
                            value={newItem.selectedService}
                            onChange={handleServiceChange}
                            options={services.map(service => ({ value: service.id, label: service.name }))}
                            placeholder="Selecione um novo item"
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
                        </div>
                        <div className="input-container">
                          <input
                            className={`input-add-item${quantityMissing ? ' input-error' : ''}`}
                            type="text"
                            placeholder='Digite uma quantidade'
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                          />
                          {quantityMissing && <span className="input-error-message">Campo obrigatório</span>}
                        </div>

                        <div className="input-container">
                          <button
                            onClick={() => {
                              handleAddItem(newItem.selectedService.value, selectedOrder.orderId, newItem.quantity);
                              fetchUpdatedOrderData(startDate, endDate);
                            }}
                            className="add-button"
                          >
                            Adicionar novo item
                          </button>
                        </div>
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
