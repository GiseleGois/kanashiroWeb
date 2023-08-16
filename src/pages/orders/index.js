import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { listProducts, listOrdersToExhibitInOrderPage } from '../../service';

function Orders() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [resumeTotal, setResumeTotal] = useState([]);
  const [totalQuantitiesOfProducts, setTotalQuantitiesOfProducts] = useState({});
  const [totalQuantitiesOfPasteis, setTotalQuantitiesOfPasteis] = useState(0);
  const [totalQuantitiesOfSalgados, setTotalQuantitiesOfSalgados] = useState(0);
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
    const fetchProducts = async () => {
      try {
        const productsData = await listProducts();
        productsData.sort((a, b) => a.priority - b.priority);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(17, 0, 0, 0);

      const endDate = new Date(now);
      endDate.setHours(3, 0, 0, 0);

      try {
        const ordersData = await listOrdersToExhibitInOrderPage(startDate, endDate);
        const extractedOrders = ordersData.combineItems;
        const extractedResume = ordersData.groupedProducts;
        const extractedTotalPasteis = ordersData.totalQuantities.totalNonSalgados;
        const extractedTotalSalgados = ordersData.totalQuantities.groupedSalgados;

        setOrders(extractedOrders);
        setResumeTotal(extractedResume);
        setTotalQuantitiesOfPasteis(extractedTotalPasteis);
        setTotalQuantitiesOfSalgados(extractedTotalSalgados);

        const totalQuantities = {};
        extractedResume.forEach(item => {
          totalQuantities[item.productId] = item.quantity;
        });
        setTotalQuantitiesOfProducts(totalQuantities);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const getItemQuantity = (productId, userFullName) => {
    const order = orders.find(order => order.userFullName === userFullName);
    if (order) {
      const item = order.items.find(item => item.productId === productId);
      return item ? item.quantity : 0;
    }
    return 0;
  };

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
          {products.map((product) => {
            const productQuantities = userFullNames.map(userFullName =>
              getItemQuantity(product.id, userFullName)
            );
            const totalQuantity = totalQuantitiesOfProducts[product.id] || 0;

            const shouldHideRow = totalQuantity === 0 && productQuantities.every(qty => qty === 0);

            if (shouldHideRow) {
              return null;
            }

            return (
              <tr key={product.id} className={product.type === 'D' ? 'yellow-row' : ''}>
                <td>{product.name}</td>
                {userFullNames.map((userFullName, index) => (
                  <td key={userFullName}>
                    {productQuantities[index]}
                  </td>
                ))}
                <td>
                  {totalQuantity}
                </td>
              </tr>
            );
          })}
          <tr>
            <td><strong>Total de pasteis</strong></td>
            <td>
              <strong>{totalQuantitiesOfPasteis}</strong>
            </td>
          </tr>
          <tr>
            <td><strong>Total de salgados</strong></td>
            <td>
              <strong>{totalQuantitiesOfSalgados}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
