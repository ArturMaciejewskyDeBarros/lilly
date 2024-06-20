import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from './firebase';
import './AddVendasClientes.css';

function AddVendasClientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      if (searchTerm) {
        const q = query(collection(db, "Clientes"), orderBy("createdAt", "desc"), limit(25));
        const querySnapshot = await getDocs(q);
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsData);
      } else {
        setClients([]);
      }
    };

    fetchClients();
  }, [searchTerm]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleNextStep = () => {
    if (selectedClient) {
      navigate('/vendas/step2', { state: { client: selectedClient } });
    } else {
      alert("Por favor, selecione um cliente.");
    }
  };

  return (
    <div className="step-container">
      <h2>Selecione o Cliente</h2>
      <input
        type="text"
        placeholder="Nome do cliente"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="client-list">
        {searchTerm && clients.filter(client => 
          client.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(client => (
          <div key={client.id} className={`client-item ${selectedClient === client ? 'selected' : ''}`} onClick={() => handleSelectClient(client)}>
            {client.nome}
          </div>
        ))}
      </div>
      <button onClick={handleNextStep} className="next-button">Avançar</button>
    </div>
  );
}

export default AddVendasClientes;
