import axios from "axios";
import config from '../config';

const listServices = async () => {
  try {
    const { data } = await axios.get(`${config.url}/services`);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter todos os serviços');
  }
};

export default listServices;
