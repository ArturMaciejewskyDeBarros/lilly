import React, { useState, useEffect } from 'react';
import './Servicos.css';
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"; 
import { db } from './firebase';
import AddServicoModal from './AddServicoModal';

function Servicos({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [servicos, setServicos] = useState([]);
  const [servicoToEdit, setServicoToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicos = async () => {
      setLoading(true);
      const q = query(collection(db, "Servicos"), orderBy("createdAt", "desc"), limit(25));
      try {
        const querySnapshot = await getDocs(q);
        const servicosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServicos(servicosData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  const saveServico = async (servicoData) => {
    if (servicoToEdit) {
      const servicoRef = doc(db, "Servicos", servicoToEdit.id);
      await updateDoc(servicoRef, servicoData);
    } else {
      await addDoc(collection(db, "Servicos"), servicoData);
    }
    setShowModal(false);
    setServicoToEdit(null);
    await fetchServicos();
  };

  const editServico = (servico) => {
    setServicoToEdit(servico);
    setShowModal(true);
  };

  const fetchServicos = async () => {
    setLoading(true);
    const q = query(collection(db, "Servicos"), orderBy("createdAt", "desc"), limit(25));
    try {
      const querySnapshot = await getDocs(q);
      const servicosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServicos(servicosData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      setLoading(false);
    }
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
      <Link to="/agendamentos" className="sidebar-item">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/servicos" className="sidebar-item active">Serviços</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <div className="service-header">
          <input
            type="text"
            placeholder="Nome do serviço, preço ou região"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => { setServicoToEdit(null); setShowModal(true); }} className="add-service-button">Adicionar Serviço</button>
        </div>
        <div className="service-list">
          {loading ? (
            <p>Carregando serviços...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome do Serviço</th>
                  <th>Preço</th>
                  <th>Região Corporal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.filter(servico => 
                  servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  servico.preco.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                  servico.regiaoCorporal.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(servico => (
                  <tr key={servico.id}>
                    <td>{servico.nome}</td>
                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)}</td>
                    <td>{servico.regiaoCorporal}</td>
                    <td>
                      <span className="action-icons" onClick={() => editServico(servico)}>📝</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && <AddServicoModal servico={servicoToEdit} onClose={() => setShowModal(false)} onSave={saveServico} />}
    </div>
  );
}

export default Servicos;
