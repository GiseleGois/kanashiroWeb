import { auth } from "../../firebase";

const userLogin = async () => {
  try {
    auth
    .signInWithEmailAndPassword(username, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
      verifyAuthorization();
    })
    .catch(error => alert(error.message))
  } catch (error) {
    throw new Error('Falha ao efetuar login');
  }
};

export default userLogin;
