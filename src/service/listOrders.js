import axios from "axios";
import config from '../../config';

const listOrders = async () => {
  try {
    const { data } = await axios.get(`${config.url}/orders`);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os pedidos');
  }
};

export default listOrders;
