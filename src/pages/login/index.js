import React from 'react';
import { auth } from '../../firebase';
import { useHistory } from 'react-router-dom';
import './style.css';

function Login() {
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push('/home');
    } catch (error) {
      alert('Erro durante o login: ' + error.message);
    }
  };

  return (
    <div className="blur-bg">
      <div className="login-container">
        <div className="card">
          <h2 className="title-field">Bem vindo(a)</h2>
          <form onSubmit={handleLogin}>
            <input type="email" id="email" name="email" className="input-field" placeholder='Digite seu email' />
            <input type="password" id="password" name="password" className="input-field" placeholder='Digite sua senha' />
            <button type="submit" className="btn-submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
