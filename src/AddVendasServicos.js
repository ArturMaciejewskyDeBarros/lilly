import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from './firebase';
import './AddVendasServicos.css';

function AddVendasServicos() {
  const [servicos, setServicos] = useState([]);
  const [selectedServicos, setSelectedServicos] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchServicos = async () => {
      const q = query(collection(db, "Servicos"), orderBy("createdAt", "desc"), limit(25));
      const querySnapshot = await getDocs(q);
      const servicosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServicos(servicosData);
    };

    fetchServicos();
  }, []);

  const handleSelectServico = (servico) => {
    if (selectedServicos.includes(servico)) {
      setSelectedServicos(selectedServicos.filter(s => s.id !== servico.id));
    } else {
      setSelectedServicos([...selectedServicos, servico]);
    }
  };

  useEffect(() => {
    const totalValue = selectedServicos.reduce((sum, servico) => sum + servico.preco, 0);
    setTotal(totalValue);
  }, [selectedServicos]);

  const handleNextStep = () => {
    if (selectedServicos.length > 0) {
      navigate('/vendas/step4', { state: { client: location.state.client, loja: location.state.loja, servicos: selectedServicos, total } });
    } else {
      alert("Por favor, selecione pelo menos um serviço.");
    }
  };

  return (
    <div className="step-container">
      <h2>Selecione os Serviços</h2>
      <div className="servico-list">
        {servicos.map(servico => (
          <div key={servico.id} className={`servico-item ${selectedServicos.includes(servico) ? 'selected' : ''}`} onClick={() => handleSelectServico(servico)}>
            {servico.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)}
          </div>
        ))}
      </div>
      <div className="total">
        Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
      </div>
      <button onClick={handleNextStep} className="next-button">Avançar</button>
    </div>
  );
}

export default AddVendasServicos;
