import React, { useState } from 'react';

function InvoiceDetails({ dateRange, weekData }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div>
      <hr />
      <p>{dateRange}</p>
      <button onClick={() => setShowDetails(!showDetails)}>
        Ver Mais Detalhes
      </button>
      {showDetails &&
        weekData.map((week, index) => (
          <div key={index}>
            {week['Total da semana'] !== undefined && (
              <p>Total da semana: {formatCurrency(Number(week['Total da semana']))}</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default InvoiceDetails;
