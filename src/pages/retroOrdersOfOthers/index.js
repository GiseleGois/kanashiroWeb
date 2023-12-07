import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import './style.css';
import { listProducts, listOrdersToExhibitInOrderPage } from '../../service';

function ShowOrdersOfOthers() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [resumeTotal, setResumeTotal] = useState([]);
  const [totalQuantitiesOfProducts, setTotalQuantitiesOfProducts] = useState({});
  const [resumeTotalNonCoxinhaFamily, setResumeTotalNonCoxinhaFamily] = useState(0);
  const [resumeTotalCoxinhaFamily, setResumeTotalCoxinhaFamily] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const goBack = () => {
    history.push('/orders');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await listProducts();
        productsData.sort((a, b) => a.priority - b.priority);
        const salgadosProducts = productsData.filter(product => product.type === 'salgado');
        setProducts(salgadosProducts);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {

      try {
        const { start, end } = history.location.state;
        const ordersData = await listOrdersToExhibitInOrderPage(start, end);
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

    if (history.location.state && history.location.state.start && history.location.state.end) {
      fetchOrders();
    }
  }, [history.location.state]);

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
    <div className="salgado-container">
      {loadingProducts ? (
        <div className="loading">Carregando produtos...</div>
      ) : (
        <table className="salgado-table">
          <thead>
            <tr>
              <th className={`product-name-header ${products.map(product => product.name).join(' ').length > 10 ? 'small-font' : 'large-header'}`}>
                Descrição
              </th>
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
                  <td key={product.id} className="product-name-cell">
                    {product.name.split('/').slice(-1)[0]}
                  </td>
                  {userFullNamesWithSalgados.map((userFullName, index) => (
                    <td key={userFullName}>{productQuantities[index]}</td>
                  ))}
                  <td className='total-column'>{totalQuantity}</td>
                </tr>
              );
            })}
            <tr>
              <td className="product-name-cell">
                <strong>Salgados</strong>
              </td>
              <td className="total-column">
                <strong>{resumeTotalCoxinhaFamily}</strong>
              </td>
            </tr>
            <tr>
              <td className="product-name-cell">
                <strong>Kibe</strong>
              </td>
              <td className="total-column">
                <strong>{resumeTotalNonCoxinhaFamily}</strong>
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
      )}
    </div>
  );

}

export default ShowOrdersOfOthers;
