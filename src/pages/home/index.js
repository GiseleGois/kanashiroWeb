import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import './style.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
    db.collection('orders').onSnapshot((snapshot) => {
      const ordersData = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });
  }, []);

  // iterar usuarios na tabela
  const usernames = [...new Set(orders.map(order => order.userFullName))];

  return (
    <div style={{ display: 'flex' }}>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            {usernames.map(username => (
              <th key={username}>{username}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              {usernames.map(userFullName => (
                <td key={userFullName}>
                  {orders.reduce((total, order) => {
                    const orderItem = order.items.find(item => item.productId === product.id);
                    console.log(orderItem)
                    if (orderItem && order.userFullName === userFullName && product.name === orderItem.product) {
                      total += orderItem.quantity;
                    }
                    return total;
                  }, 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
