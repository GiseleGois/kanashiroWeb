import axios from "axios";
import config from '../config';

const updateOrder = async (orderId) => {
  try {
    let productId = {
      id: '123456'
    }

    const { data } = await axios.post(`${config.url}/edit-order/${orderId}/${productId.id}`);
    return data;
  } catch (error) {
    throw new Error('Falha ao tentar atualizar o pedido', error);
  }
};

export default updateOrder;
