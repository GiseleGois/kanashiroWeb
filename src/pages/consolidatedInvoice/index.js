import React, { useEffect, useState } from 'react';
import { resumeInvoices } from '../../service';
import Modal from '../../commons/modal/consolidatedModal';
import './style.css';

function ConsolidatedInvoice() {
  const [invoiceData, setInvoiceData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await resumeInvoices();
        setInvoiceData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da API', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const openModal = (dateRange, weekData) => {
    setSelectedSummary({ dateRange, weekData });
  };

  const closeModal = () => {
    setSelectedSummary(null);
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className="consolidatedInvoice-container">
      <h1>Resumo de Faturas</h1>
      <p>Ano: {year}</p>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        Object.entries(invoiceData).map(([dateRange, weekData], dateIndex) => (
          <div key={dateRange}>
            <hr
              className={`separator ${hoveredCard === dateIndex ? 'selected-card' : ''}`}
              onMouseEnter={() => handleCardHover(dateIndex)}
              onMouseLeave={handleCardLeave}
            />
            <div
              className={`data-container ${hoveredCard === dateIndex ? 'selected-card' : ''}`}
              onMouseEnter={() => handleCardHover(dateIndex)}
              onMouseLeave={handleCardLeave}
              onClick={() => openModal(dateRange, weekData)}
            >
              <p>{dateRange}</p>
              {weekData.map((week, index) => (
                <div key={index}>
                  {week['Total da semana'] !== undefined && (
                    <p>Total da semana: {formatCurrency(Number(week['Total da semana']))}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selectedSummary && (
        <Modal
          isOpen={!!selectedSummary}
          onClose={closeModal}
          showSuccessModal={false}
          consolidatedData={selectedSummary}
          dateRange={selectedSummary.dateRange}
          weekData={selectedSummary.weekData}
        />
      )}

    </div>
  );
}

export default ConsolidatedInvoice;
