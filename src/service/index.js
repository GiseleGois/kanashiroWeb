import axios from "axios";
import config from '../config';

const ordersThisWeek = async (startDate, endDate) => {
  try {
    const endDateTime = new Date(endDate)
    endDateTime.setHours(23, 59, 59, 999);
    const endDateISO = endDateTime.toISOString();

    const { data } = await axios.get(`${config.url}/v2/orders`, {
      params: { startDate, endDate: endDateISO },
    });
    console.log('orders:', data);
    return data;
  } catch (error) {
    throw new Error('Failed to retrieve orders');
  }
};

const fetchOrderById = async (orderId) => {
  try {
    const { data } = await axios.get(`${config.url}/v2/fetch-order/${orderId}`);
    return data;
  } catch (error) {
    throw new Error('Failed to retrieve orders');
  }
};

const closeInvoice = async (orders) => {
  try {
    const { data } = await axios.post(`${config.url}/invoice`, {
      orders
    });
    return data;
  } catch (error) {
    throw new Error('Fail to create a new invoice');
  }
};

const getInvoicesByInvoiceId = async (invoiceId) => {
  try {
    const { data } = await axios.get(`${config.url}/invoice/${invoiceId}`);
    return data;
  } catch (error) {
    throw new Error('Failed to retrieve invoices');
  }
};

const listProductsToUpdateOrders = async () => {
  try {
    const { data } = await axios.get(`${config.url}/fetch-product-type`);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os serviços');
  }
};

const insertItem = async (orderId, productId, quantity) => {
  try {
    const quantityNumber = parseInt(quantity);
    const { data } = await axios.put(`${config.url}/update-order/${orderId}`, {
      items: [
        {
          quantity: quantityNumber,
          id: productId,
        }
      ]
    });

    return data;
  } catch (error) {
    throw new Error('Fail to include a new item');
  }
};

const removeItem = async (orderId, itemToRemove) => {
  try {

    const { data } = await axios.put(`${config.url}/update-order-remove-item/${orderId}`, {
      items: [
        {
          id: itemToRemove,
        }
      ]
    });

    return data;
  } catch (error) {
    throw new Error('Fail to remove item');
  }
};

const listOrders = async (startDate, endDate) => {
  try {
    const endDateTime = new Date(endDate)
    endDateTime.setHours(23, 59, 59, 999);
    const endDateISO = endDateTime.toISOString();

    const { url } = config;

    const instance = axios.create({
      baseURL: url,
      headers: {
        'Content-type': 'application/json',
      },
    });

    const { data } = await instance.get(`/fetch-order-by-date`, {
      params: { startDate, endDate: endDateISO },
    });

    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os pedidos' + error);
  }
};

const listOrdersToExhibitInOrderPage = async (startDate, endDate) => {
  try {
    const endDateTime = new Date(endDate)
    endDateTime.setHours(23, 59, 59, 999);
    const endDateISO = endDateTime.toISOString();

    const { url } = config;

    const instance = axios.create({
      baseURL: url,
      headers: {
        'Content-type': 'application/json',
      },
    });

    const { data } = await instance.get(`/fetch-orders`, {
      params: { startDate, endDate: endDateISO },
    });

    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os pedidos' + error);
  }
};

const listProducts = async () => {
  try {
    const { data } = await axios.get(`${config.url}/products`);
    const getProducts = data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d');
    return getProducts;
  } catch (error) {
    throw new Error('Falha ao obter todos os produtos');
  }
};

const listAllProductType = async () => {
  try {
    const { data } = await axios.get(`${config.url}/types`);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os produtos');
  }
};

const updateProductType = async (productData) => {
  try {
    const { data } = await axios.put(`${config.url}/update-product`, productData);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os produtos');
  }
};

const getUserData = async (userId) => {
  try {
    const { data } = await axios.get(`${config.url}/user-by-id/${userId}`);
    return data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};

const usersData = async () => {
  try {
    const { data } = await axios.get(`${config.url}/users`);
    return data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};

const enableUser = async (userPermission) => {
  try {
    const { data } = await axios.put(`${config.url}/enable-user/${userPermission.uuid}`, {
      authorizer: userPermission.authorizer
    });
    return data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};

const checkUserPermission = async (userId) => {
  try {
    const { data } = await axios.get(`${config.url}/check-permission/${userId}`);
    return data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};

const sendInvoiceToUser = async (phone, invoiceData) => {
  const {
    nome,
    date,
    total,
    status,
  } = invoiceData;

  const {
    urlApiBrasil,
    secretKey,
    publicToken,
    deviceToken,
    token,
  } = config;

  try {
    const instance = axios.create({
      baseURL: urlApiBrasil,
      headers: {
        'Content-type': 'application/json',
        SecretKey: secretKey,
        PublicToken: publicToken,
        DeviceToken: deviceToken,
        Authorization: token,
      },
    });

    const payload = {
      number: `55${phone}`,
      text: `Olá ${nome}, sua fatura fechou\n\n Data: ${date}\nTotal: $${total}\nStatus: ${status}\n\n *Obs: O não pagamento de sua fatura pode gerar um bloqueio temporario na sua conta.`,
      time_typing: 1,
    };

    const { data } = await instance.post(`/api/v1/whatsapp/sendText`, payload);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os produtos');
  }
};

export {
  ordersThisWeek,
  fetchOrderById,
  closeInvoice,
  getInvoicesByInvoiceId,
  listProductsToUpdateOrders,
  insertItem,
  removeItem,
  listOrders,
  listOrdersToExhibitInOrderPage,
  listProducts,
  listAllProductType,
  updateProductType,
  getUserData,
  usersData,
  enableUser,
  checkUserPermission,
  sendInvoiceToUser,
};
