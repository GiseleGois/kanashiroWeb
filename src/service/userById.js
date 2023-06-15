import axios from "axios";
import { auth } from "../../firebase";
import config from '../../config';

const userById = async () => {
  try {
    const { data } = await axios.get(`${config.url}/user-by-id/${auth.currentUser.uid}`);
    return data;
  } catch (error) {
    throw new Error('Falha ao obter o usuario');
  }
};

export default userById;
