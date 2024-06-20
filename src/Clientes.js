import React, { useState, useEffect } from 'react';
import './Clientes.css';
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"; 
import { db } from './firebase';
import AddClientModal from './AddClientModal';
import ClienteDetalhes from './ClienteDetalhes';

function Clientes({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientToView, setClientToView] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const q = query(collection(db, "Clientes"), orderBy("createdAt", "desc"), limit(25));
    try {
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(clientsData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setLoading(false);
    }
  };

  const saveClient = async (clientData) => {
    if (clientToEdit) {
      const clientRef = doc(db, "Clientes", clientToEdit.id);
      await updateDoc(clientRef, clientData);
    } else {
      await addDoc(collection(db, "Clientes"), clientData);
    }
    setShowModal(false);
    setClientToEdit(null);
    await fetchClients();
  };

  const editClient = (client) => {
    setClientToEdit(client);
    setShowModal(true);
  };

  const viewClientDetails = (client) => {
    setClientToView(client);
    setShowDetailsModal(true);
  };

  const softDeleteClient = async (id) => {
    const clientRef = doc(db, "Clientes", id);
    await updateDoc(clientRef, { isActive: false });
    await fetchClients();
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
      <Link to="/agendamentos" className="sidebar-item">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item active">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/servicos" className="sidebar-item">Serviços</Link>
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
          {loading ? (
            <p>Carregando clientes...</p>
          ) : (
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
                {clients.filter(client => 
                  client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  client.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  client.celular.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(client => (
                  <tr key={client.id}>
                    <td>{client.nome}</td>
                    <td>{client.email}</td>
                    <td>{client.celular}</td>
                    <td>{client.dataNascimento}</td>
                    <td>
                      <span className="action-icons" onClick={() => editClient(client)}>📝</span>
                      <span className="action-icons" onClick={() => viewClientDetails(client)}>🔍</span>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && <AddClientModal client={clientToEdit} onClose={() => setShowModal(false)} onSave={saveClient} />}
      {showDetailsModal && <ClienteDetalhes client={clientToView} onClose={() => setShowDetailsModal(false)} />}
    </div>
  );
}

export default Clientes;
