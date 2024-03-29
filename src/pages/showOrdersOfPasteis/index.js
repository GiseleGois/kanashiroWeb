import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import './style.css';
import { listProducts, listOrdersToExhibitInOrderPage } from '../../service';

function ShowOrdersOfPasteis() {
  const history = useHistory();
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
        const filteredProducts = productsData.filter(product => product.type !== 'salgado');
        filteredProducts.sort((a, b) => a.priority - b.priority);
        setProducts(filteredProducts);
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

        const filteredOrders = ordersData.combineItems.filter((order) => {
          return order.items.some((item) => item.type !== 'salgado');
        });

        const extractedResume = ordersData.groupedProducts.filter(item => item.type !== 'salgado');

        const extractedTotalPasteis = ordersData.totalQuantities.totalNonSalgados;

        setOrders(filteredOrders);
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

  const goBack = () => {
    history.push('/orders');
  };

  const userFullNames = [...new Set(orders.map(order => order.userFullName))];
  userFullNames.sort((a, b) => a.localeCompare(b));

  const shouldDisplayOrder = (order) => {
    return order.items.some((item) => products.find((product) => product.id === item.productId && product.type !== 'salgado'));
  };

  return (
    <div className="pastel-container">
      {loadingProducts ? (
        <div className="loading">Carregando produtos...</div>
      ) : (
        <div>
          <table className="pastel-table">
            <thead className="sticky-header">
              <tr>
                <th>Descrição</th>
                {userFullNames.map((userFullName) => (
                  <th key={userFullName}>{userFullName}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => {
                  return orders.some(
                    (order) =>
                      shouldDisplayOrder(order) && getItemQuantity(product.id, order.userFullName) > 0
                  );
                })
                .map((product, index) => {
                  const productQuantities = userFullNames.map((userFullName) =>
                    getItemQuantity(product.id, userFullName)
                  );
                  const totalQuantity = totalQuantitiesOfProducts[product.id] || 0;

                  const rowClassName = `product-row
        ${product.type === 'M' ? 'blue-row' : ''}
        ${product.type === 'D' ? 'yellow-row' : ''}
        ${product.family === '1' ? 'salmon-row' : ''}
        ${product.family === '2' ? 'light-blue-row' : ''}
        ${product.family === '3' ? 'g-row' : ''}
        ${product.family === '4' ? 'c-row' : ''}
        ${product.family === '5' ? 'd-row' : ''}
        ${product.family === '6' ? 'e-row' : ''}
        ${product.family === '7' ? 'f-row' : ''}
        `;

                  return (
                    <tr key={product.id} className={rowClassName}>
                      <td className={`description-column`}>{product.name}</td>
                      {userFullNames.map((userFullName, index) => (
                        <td key={userFullName} className={index === 0 ? 'first-column' : ''}>
                          {productQuantities[index]}
                        </td>
                      ))}
                      <td className={`total-column ${index === 0 ? 'first-column' : ''}`}>
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
            <tfoot>
              <tr>
                <td colSpan={userFullNames.length + 2}>
                  <button onClick={goBack} className="back-button">
                    <ArrowLeft size={24} />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowOrdersOfPasteis;
