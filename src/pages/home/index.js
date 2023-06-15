import React, { useEffect, useRef } from 'react';
import { Table, Package, Edit, Clipboard, Archive, X, Mail, Phone, User } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';

function Home() {
  const history = useHistory();
  const servicosRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

  const handleScroll = (e) => {
    e.preventDefault();
    const target = servicosRef.current;
    target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      history.push('/');
    });
  };

  const handleOrders = () => {
    history.push('/orders');
  };

  const handleUpdateOrder = () => {
    history.push('/update-order');
  };

  const handleBilling = () => {
    history.push('/billing');
  };

  const handleProducts = () => {
    history.push('/products');
  };

  return (
    <div className="home-container">
      <header className="header">
        <nav>
          <p>Kanashiro Pastéis</p>
          <ul>
            <li><a href="#servicos" onClick={handleScroll}>Exibir os pedidos</a></li>
            <li><a href="#servicos" onClick={handleScroll}>Editar pedidos</a></li>
            <li><a href="#servicos" onClick={handleScroll}>Faturamento</a></li>
            <li><a href="#servicos" onClick={handleScroll}>Produtos</a></li>
            <li><a href="#servicos" onClick={handleLogout}>Sair</a></li>
          </ul>
        </nav>

        <div id="home" className="header-content">
          <h1>Bem vindo(a) {auth.user}</h1>
        </div>
      </header>

      <section id="servicos" className="servicos" ref={servicosRef}>
        <h1 className="servicos-title">Serviços</h1>
        <div className="servicos-cards">
          <div className="card">
            <Table />
            <div className="card-content">
              <h3>Exibir os pedidos</h3>
              <p>Visualize todos os pedidos efetuados para a data atual.</p>
              <button onClick={handleOrders}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Edit />
            <div className="card-content">
              <h3>Editar pedidos</h3>
              <p>Visualize os detalhes do pedido e edite caso necessário.</p>
              <button onClick={handleUpdateOrder}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Clipboard />
            <div className="card-content">
              <h3>Faturamento</h3>
              <p>Exibir todas as vendas e realizar a cobrança dos pedidos.</p>
              <button onClick={handleBilling}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Package />
            <div className="card-content">
              <h3>Produtos</h3>
              <p>Consultar, criar e editar produtos.</p>
              <button onClick={handleProducts}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Archive />
            <div className="card-content">
              <h3>Estoque</h3>
              <p>Exibir estoque de produtos.</p>
              <button>Exibir</button>
            </div>
          </div>

          <div className="card">
            <X />
            <div className="card-content">
              <h3>Sair</h3>
              <p>Sair da página.</p>
              <button onClick={handleLogout}>Sair</button>
            </div>
          </div>

        </div>
      </section>


      <footer className="footer">
        <section id="contato" className="contato">
          <div className="contato-card">
            <h1>Entre em contato com os desenvolvedores</h1>
            <div className="contato-columns">
              <div className="contato-column">
                <h3><User />Gisele F Gois</h3>
                <ul>
                  <li><Mail />giselefgois@gmail.com</li>
                  <li><Phone />(11) 97063-5734</li>
                </ul>
              </div>
              <div className="contato-column">
                <h3><User />Jeniffer A Souza</h3>
                <ul>
                  <li><Mail />jen_as@outlook.com</li>
                  <li><Phone />(19) 99294-8383</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default Home;
