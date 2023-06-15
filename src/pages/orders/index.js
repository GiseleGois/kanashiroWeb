import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../../firebase';
import './style.css';

function Orders() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

  useEffect(() => {
    db.collection('products').onSnapshot((snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      productsData.sort((a, b) => a.priority - b.priority);
      setProducts(productsData);
    });
  }, []);

  useEffect(() => {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 1);
    startTime.setHours(14, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(3, 59, 0, 0);

    setStartDate(startTime);
    setEndDate(endTime);

    const unsubscribe = db.collection('orders')
      .where('createAt', '>=', startTime)
      .where('createAt', '<', endTime)
      .onSnapshot((snapshot) => {
        const ordersData = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersData);
      });

    return () => unsubscribe();
  }, []);

  const userFullNames = [...new Set(orders.map(order => order.userFullName))];

  const calculateTotalQuantity = (productId, priorityMin, priorityMax) => {
    return orders.reduce((total, order) => {
      const orderItem = order.items.find(item => item.productId === productId);
      if (orderItem) {
        const product = products.find(product => product.id === productId);
        if (product && product.priority >= priorityMin && product.priority <= priorityMax) {
          total += orderItem.quantity;
        }
      }
      return total;
    }, 0);
  };

  const calculateTotalQuantityByPriorityRange = (priorityMin, priorityMax) => {
    return products.reduce((total, product) => {
      if (product.priority >= priorityMin && product.priority <= priorityMax) {
        const productQuantity = calculateTotalQuantity(product.id, priorityMin, priorityMax);
        total += productQuantity;
      }
      return total;
    }, 0);
  };

  const totalQuantityPriority1to32 = calculateTotalQuantityByPriorityRange(1, 32);

  const totalQuantityPriority33to43 = calculateTotalQuantityByPriorityRange(33, 43);

  return (
    <div style={{ display: 'flex' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            {userFullNames.map(userFullName => (
              <th key={userFullName}>{userFullName}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={product.type === 'D' ? 'yellow-row' : ''}>
              <td>{product.name}</td>
              {userFullNames.map(userFullName => (
                <td key={userFullName}>
                  {orders.reduce((total, order) => {
                    const orderItem = order.items.find(item => item.productId === product.id && item.product === product.name);
                    if (orderItem && order.userFullName === userFullName) {
                      total += orderItem.quantity;
                    }
                    return total;
                  }, 0)}
                </td>
              ))}
              <td>
                {orders.reduce((total, order) => {
                  const orderItem = order.items.find(item => item.productId === product.id && item.product === product.name);
                  if (orderItem) {
                    total += orderItem.quantity;
                  }
                  return total;
                }, 0)}
              </td>
            </tr>
          ))}
          <tr>
            <td><strong>Total de pasteis</strong></td>
            {userFullNames.map(userFullName => (
              <td key={userFullName}></td>
            ))}
            <td>
              <strong>{totalQuantityPriority1to32}</strong>
            </td>
          </tr>
          <tr>
            <td><strong>Total de salgados</strong></td>
            {userFullNames.map(userFullName => (
              <td key={userFullName}>
                {orders.reduce((total, order) => {
                  const orderItem = order.items.find(item => {
                    const product = products.find(p => p.id === item.productId);
                    return product && product.priority >= 33 && product.priority <= 43 && item.product === product.name;
                  });
                  if (orderItem && order.userFullName === userFullName) {
                    total += orderItem.quantity;
                  }
                  return total;
                }, 0)}
              </td>
            ))}
            <td>
              <strong>{totalQuantityPriority33to43}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
