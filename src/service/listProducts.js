import axios from "axios";
import config from '../../config';

const listProducts = async () => {
  try {
    const { data } = await axios.get(`${config.url}/products`);
    const getProducts = data.filter(product => product.type !== 'papel');
    return getProducts;
  } catch (error) {
    throw new Error('Falha ao obter todos os produtos');
  }
};

export default listProducts;
