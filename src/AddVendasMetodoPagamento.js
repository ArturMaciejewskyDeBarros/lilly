import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase';
import './AddVendasMetodoPagamento.css';

function AddVendasMetodoPagamento() {
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectMetodo = (metodo) => {
    setMetodoPagamento(metodo);
  };

  const handleFinalizar = async () => {
    if (metodoPagamento) {
      const vendaData = {
        cliente: location.state.client,
        loja: location.state.loja,
        servicos: location.state.servicos,
        total: location.state.total,
        metodoPagamento,
        createdAt: new Date()
      };
      await addDoc(collection(db, "Vendas"), vendaData);
      navigate('/vendas');
    } else {
      alert("Por favor, selecione um método de pagamento.");
    }
  };

  return (
    <div className="step-container">
      <h2>Selecione o Método de Pagamento</h2>
      <div className="metodo-list">
        {['Pix', 'Débito', 'Crédito', 'Dinheiro'].map(metodo => (
          <div key={metodo} className={`metodo-item ${metodoPagamento === metodo ? 'selected' : ''}`} onClick={() => handleSelectMetodo(metodo)}>
            {metodo}
          </div>
        ))}
      </div>
      <button onClick={handleFinalizar} className="finalizar-button">Finalizar</button>
    </div>
  );
}

export default AddVendasMetodoPagamento;
