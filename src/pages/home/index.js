import React, { useEffect, useRef, useState } from 'react';
import { Table, Package, Edit, Clipboard, Users, X } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { checkUserPermission } from '../../service';

function Home() {
  const history = useHistory();
  const servicosRef = useRef(null);

  const [hasAccess, setHasAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push('/');
      } else {
        checkUserPermission(user.uid)
          .then(response => {
            setHasAccess(response.hasAccess);
            setLoading(false);
          })
          .catch(error => {
            console.error("Error checking user permission:", error);
            setHasAccess(false);
            setLoading(false);
          });
      }
    });

    return () => unsubscribeAuth();
  }, [history]);

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

  const handleManageUsers = () => {
    history.push('/management-users');
  };

  return (
    <div className="home-container">
      <header className="header">
        <nav>
          <p>Kanashiro Pastéis</p>
        </nav>

        <div id="home" className="header-content">
          <h1>Bem vindo(a)</h1>
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
              <button onClick={handleUpdateOrder} disabled={!hasAccess || loading}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Clipboard />
            <div className="card-content">
              <h3>Faturamento</h3>
              <p>Exibir todas as vendas e realizar a cobrança dos pedidos.</p>
              <button onClick={handleBilling} disabled={!hasAccess || loading}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Package />
            <div className="card-content">
              <h3>Produtos</h3>
              <p>Consultar, criar e editar produtos.</p>
              <button onClick={handleProducts} disabled={!hasAccess || loading}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Users />
            <div className="card-content">
              <h3>Gerenciar usuários</h3>
              <p>Habilitar e desabilitar login de usuário.</p>
              <button onClick={handleManageUsers} disabled={!hasAccess || loading}>Exibir</button>
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
    </div>
  );
}

export default Home;
