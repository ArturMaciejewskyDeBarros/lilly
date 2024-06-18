import React, { useState, useEffect } from 'react';
import './Clientes.css';
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"; 
import { db } from './firebase';
import AddClientModal from './AddClientModal';

function Clientes({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Busca e define os clientes
  useEffect(() => {
    const fetchClients = async () => {
      // Supondo que exista um campo 'createdAt' para ordenação
      const q = query(collection(db, "Clientes"), orderBy("createdAt", "desc"), limit(25));
      try {
        const querySnapshot = await getDocs(q);
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsData);
        console.log("Clientes carregados:", clientsData); // Log para verificar os dados
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);

  const saveClient = async (clientData) => {
    if (clientToEdit) {
      // Atualiza cliente existente
      const clientRef = doc(db, "Clientes", clientToEdit.id);
      await updateDoc(clientRef, clientData);
    } else {
      // Adiciona novo cliente
      await addDoc(collection(db, "Clientes"), clientData);
    }
    setShowModal(false);
    setClientToEdit(null); // Reseta o cliente para edição
  };

  const editClient = (client) => {
    setClientToEdit(client);
    setShowModal(true);
  };

  const softDeleteClient = async (id) => {
    const clientRef = doc(db, "Clientes", id);
    await updateDoc(clientRef, { isActive: false });
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
        <Link to="/clientes" className="sidebar-item active">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <div className="client-header">
          <input
            type="text"
            placeholder="Nome, CPF ou telefone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => { setClientToEdit(null); setShowModal(true); }} className="add-client-button">Adicionar Cliente</button>
        </div>
        <div className="client-list">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Data de Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.nome}</td>
                  <td>{client.email}</td>
                  <td>{client.celular}</td>
                  <td>{client.dataNascimento}</td>
                  <td>
                    <span className="action-icons" onClick={() => editClient(client)}>📝</span>
                    <span className="action-icons" onClick={() => softDeleteClient(client.id)}>🗑️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <AddClientModal client={clientToEdit} onClose={() => setShowModal(false)} onSave={saveClient} />}
    </div>
  );
}

export default Clientes;