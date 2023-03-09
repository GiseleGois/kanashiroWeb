import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import './style.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      .where('date', '>=', startTime)
      .where('date', '<', endTime)
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
                    const orderItem = order.items.find(item => item.productId === product.id);
                    if (orderItem && order.userFullName === userFullName && product.name === orderItem.product) {
                      total += orderItem.quantity;
                    }
                    return total;
                  }, 0)}
                </td>
              ))}
              <td>
                {orders.reduce((total, order) => {
                  const orderItem = order.items.find(item => item.productId === product.id);
                  if (orderItem && product.name === orderItem.product) {
                    total += orderItem.quantity;
                  }
                  return total;
                }, 0)}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Home;
