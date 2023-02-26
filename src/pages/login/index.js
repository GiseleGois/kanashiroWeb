import React from 'react';
import banner from '../../assets/kanashiro.png'

import './style.css';

export default function Login() {

  return (
<body>
    <main>
        <h1>Login</h1>

        <div class="alternative">
        </div>

        <form action="">

            <label for="text">
                <span>Usuario</span>
                <input type="text" id="text" name="text"/>
            </label>
            <label for="password">
                <span>Senha</span>
                <input type="password" id="password" name="password"/>
            </label>

            <input type="submit" value="Sign Up"/>
        </form>
    </main>

    <section class="images">
        <img src={banner} alt="logo"/>
        <div class="circle"></div>
    </section>
</body>
  );
}