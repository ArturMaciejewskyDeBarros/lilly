import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from './firebase';
import './AddVendasLojas.css';

function AddVendasLojas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lojas, setLojas] = useState([]);
  const [selectedLoja, setSelectedLoja] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLojas = async () => {
      const q = query(collection(db, "Lojas"), orderBy("createdAt", "desc"), limit(25));
      const querySnapshot = await getDocs(q);
      const lojasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLojas(lojasData);
    };

    fetchLojas();
  }, []);

  const handleSelectLoja = (loja) => {
    setSelectedLoja(loja);
  };

  const handleNextStep = () => {
    if (selectedLoja) {
      navigate('/vendas/step3', { state: { client: location.state.client, loja: selectedLoja } });
    } else {
      alert("Por favor, selecione uma loja.");
    }
  };

  return (
    <div className="step-container">
      <h2>Selecione a Loja</h2>
      <input
        type="text"
        placeholder="Nome da loja"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="loja-list">
        {lojas.filter(loja => 
          loja.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(loja => (
          <div key={loja.id} className={`loja-item ${selectedLoja === loja ? 'selected' : ''}`} onClick={() => handleSelectLoja(loja)}>
            {loja.nome}
          </div>
        ))}
      </div>
      <button onClick={handleNextStep} className="next-button">Avançar</button>
    </div>
  );
}

export default AddVendasLojas;
