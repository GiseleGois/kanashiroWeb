import React, { useState, useEffect } from 'react';
import './style.css';
import { listProducts, listOrdersToExhibitInOrderPage } from '../../service';

function ShowOrdersOfOthers() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [resumeTotal, setResumeTotal] = useState([]);
  const [totalQuantitiesOfProducts, setTotalQuantitiesOfProducts] = useState({});
  const [resumeTotalNonCoxinhaFamily, setResumeTotalNonCoxinhaFamily] = useState(0);
  const [resumeTotalCoxinhaFamily, setResumeTotalCoxinhaFamily] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await listProducts();
        productsData.sort((a, b) => a.priority - b.priority);
        const salgadosProducts = productsData.filter(product => product.type === 'salgado');
        setProducts(salgadosProducts);
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
        const coxinhaFamilyTotal = ordersData.totalQuantities.coxinhaFamily;
        const nonCoxinhaFamilyTotal = ordersData.totalQuantities.nonCoxinhaFamily;

        setResumeTotalNonCoxinhaFamily(nonCoxinhaFamilyTotal);
        setResumeTotalCoxinhaFamily(coxinhaFamilyTotal);

        setOrders(extractedOrders);
        setResumeTotal(extractedResume);

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

  const userFullNamesWithSalgados = userFullNames.filter(userFullName => {
    return products.some(product => getItemQuantity(product.id, userFullName) > 0);
  });

  userFullNamesWithSalgados.sort((a, b) => a.localeCompare(b));

  return (
    <div className="print-container">
      <table className="print-table">
        <thead>
          <tr>
            <th>Descrição</th>
            {userFullNamesWithSalgados.map(userFullName => (
              <th
                className={userFullName.length > 20 ? 'small-font' : 'large-header'}
                key={userFullName}
              >
                {userFullName}
              </th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const productQuantities = userFullNamesWithSalgados.map(userFullName =>
              getItemQuantity(product.id, userFullName)
            );
            const totalQuantity = totalQuantitiesOfProducts[product.id] || 0;

            const shouldHideRow = totalQuantity === 0 && productQuantities.every(qty => qty === '');

            const rowClassName = `product-row ${product.type === 'salgado' ? 'blue-row' : ''}`;

            if (shouldHideRow) {
              return null;
            }

            return (
              <tr key={product.id} className={rowClassName}>
                <td>{product.name}</td>
                {userFullNamesWithSalgados.map((userFullName, index) => (
                  <td key={userFullName}>{productQuantities[index]}</td>
                ))}
                <td className='total-column'>{totalQuantity}</td>
              </tr>
            );
          })}
          <tr>
            <td>
              <strong>Total de salgados</strong>
            </td>
            <td>
              <strong>{resumeTotalCoxinhaFamily}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Total de Kibe</strong>
            </td>
            <td>
              <strong>{resumeTotalNonCoxinhaFamily}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

}

export default ShowOrdersOfOthers;