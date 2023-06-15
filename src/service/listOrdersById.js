import axios from "axios";
import { auth } from "../firebase";
import config from '../config';

const listOrdersById = async () => {
  try {
    const { data } = await axios.get(`${config.url}/orders-by-id/${auth.currentUser.uid}`);
    const responseData = {
      data
    }
    return responseData;
  } catch (error) {
    throw new Error('Falha ao obter os pedidos');
  }
};

export default listOrdersById;
