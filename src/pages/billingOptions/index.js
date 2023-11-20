import React, { useRef, useState } from 'react';
import { BarChart2, Trello, DollarSign, Home, FileText } from 'react-feather';
import { useHistory } from 'react-router-dom';
import './style.css';
// import { checkUserPermission } from '../../service';

function BillingOptions() {
  const history = useHistory();
  const servicosRef = useRef(null);

  // const [loading, setLoading] = useState(true);

  const handleBackToHome = () => {
    history.push('/home');
  };

  const handleCloseInvoice = () => {
    history.push('/new-billing');
  };

  const handleCheckInvoices = () => {
    history.push('/check-invoices');
  };

  const handleUpdateInvoice = () => {
    history.push('/payment-invoice');
  };

  const handleConsolidatedInvoice = () => {
    history.push('/consolidated-invoice');
  };

  return (
    <div className="home-container">

      <section id="servicos" className="servicos" ref={servicosRef}>
        <h1 className="servicos-title">Serviços</h1>
        <div className="servicos-cards">

        <div className="card">
            <FileText />
            <div className="card-content">
              <h3>Fechamento de fatura</h3>
              <p>Realizar fechamento de fatura.</p>
              <button onClick={handleCloseInvoice}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Trello />
            <div className="card-content">
              <h3>Exibir as faturas pendentes</h3>
              <p>Visualize todos os usuarios com faturas pendentes.</p>
              <button onClick={handleCheckInvoices}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <DollarSign />
            <div className="card-content">
              <h3>Atualizar divida do usuario</h3>
              <p>Pagamento de uma porcentagem da divida.</p>
              <button onClick={handleUpdateInvoice}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <BarChart2 />
            <div className="card-content">
              <h3>Consolidado da semana</h3>
              <p>Relatório dos fechamentos da semana.</p>
              <button onClick={handleConsolidatedInvoice}>Exibir</button>
            </div>
          </div>

          <div className="card">
            <Home />
            <div className="card-content">
              <h3>Voltar</h3>
              <p>Voltar para a página inicial.</p>
              <button onClick={handleBackToHome}>Voltar</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BillingOptions;
