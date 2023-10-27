import React, { useState, useEffect } from 'react';
import './style.css';
import { listProducts, listOrdersToExhibitInOrderPage } from '../../service';

function ShowOrdersOfPasteis() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [resumeTotal, setResumeTotal] = useState([]);
  const [totalQuantitiesOfProducts, setTotalQuantitiesOfProducts] = useState({});
  const [totalQuantitiesOfPasteis, setTotalQuantitiesOfPasteis] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await listProducts();
        productsData.sort((a, b) => a.priority - b.priority);
        setProducts(productsData);
        setLoadingProducts(false);
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

        setOrders(extractedOrders);
        setResumeTotal(extractedResume);
        setTotalQuantitiesOfPasteis(extractedTotalPasteis);

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
      return item ? item.quantity : '';
    }
    return 0;
  };

  const userFullNames = [...new Set(orders.map(order => order.userFullName))];
  userFullNames.sort((a, b) => a.localeCompare(b));

  return (
    <div className="print-container">
      {loadingProducts ? (
        <div className="loading">Carregando produtos...</div>
      ) : (
        <table className="print-table">
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
            {products
              .filter(product => product.type !== 'salgado')
              .map((product) => {
                const productQuantities = userFullNames.map(userFullName =>
                  getItemQuantity(product.id, userFullName)
                );
                const totalQuantity = totalQuantitiesOfProducts[product.id] || 0;

                const shouldHideRow = totalQuantity === 0 && productQuantities.every(qty => qty === '');

                const rowClassName = `product-row ${product.type === 'M' ? 'blue-row' : ''} ${product.type === 'D' ? 'yellow-row' : ''}`;

                if (shouldHideRow) {
                  return null;
                }

                return (
                  <tr key={product.id} className={rowClassName}>
                    <td className="product-name">{product.name}</td> {/* Apply product-name class here */}
                    {userFullNames.map((userFullName, index) => (
                      <td key={userFullName}>
                        {productQuantities[index]}
                      </td>
                    ))}
                    <td className='total-column'>
                      {totalQuantity}
                    </td>
                  </tr>
                );
              })}
            <tr>
            <td className="product-name">
              <strong>Total de pasteis</strong>
              </td>
              <td>
                <strong>{totalQuantitiesOfPasteis}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ShowOrdersOfPasteis;
