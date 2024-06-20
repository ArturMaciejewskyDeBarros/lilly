import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Agendamentos.css';
import { collection, query, where, orderBy, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from './firebase';
import AddAgendamentoModal from './AddAgendamentoModal';

function Agendamentos({ onLogout }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchLoja, setSearchLoja] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lojas, setLojas] = useState([]);

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchAgendamentos = async (date, loja) => {
    setLoading(true);
    const constraints = [];
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); // Include the entire day
      constraints.push(where("data", ">=", Timestamp.fromDate(startDate)));
      constraints.push(where("data", "<", Timestamp.fromDate(endDate)));
    }
    if (loja) constraints.push(where("loja.id", "==", loja));
    const q = query(collection(db, "Agendamentos"), ...constraints, orderBy("data"));
    try {
      const querySnapshot = await getDocs(q);
      const agendamentosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAgendamentos(agendamentosData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setLoading(false);
    }
  };

  const fetchLojas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Lojas"));
      const lojasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLojas(lojasData);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
    }
  };

  const handleAddAgendamento = async (agendamentoData) => {
    try {
      await addDoc(collection(db, "Agendamentos"), agendamentoData);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
    }
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
        <Link to="/agendamentos" className="sidebar-item active">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/servicos" className="sidebar-item">Serviços</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <div className="agendamento-header">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="search-input"
          />
          <select
            value={searchLoja}
            onChange={(e) => setSearchLoja(e.target.value)}
            className="search-input"
          >
            <option value="">Selecione uma loja</option>
            {lojas.map(loja => (
              <option key={loja.id} value={loja.id}>{loja.nome}</option>
            ))}
          </select>
          <button onClick={() => fetchAgendamentos(searchDate, searchLoja)} className="search-button">Buscar</button>
          <button onClick={() => setShowModal(true)} className="add-agendamento-button">Adicionar Agendamento</button>
        </div>
        <div className="agendamento-list">
          {loading ? (
            <p>Carregando agendamentos...</p>
          ) : (
            agendamentos.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Loja</th>
                    <th>Data</th>
                    <th>Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map(agendamento => (
                    <tr key={agendamento.id}>
                      <td>{agendamento.cliente.nome}</td>
                      <td>{agendamento.servico.nome}</td>
                      <td>{agendamento.loja.nome}</td>
                      <td>{new Date(agendamento.data.seconds * 1000).toLocaleDateString()}</td>
                      <td>{agendamento.horario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum agendamento encontrado para os critérios selecionados.</p>
            )
          )}
        </div>
      </div>
      {showModal && <AddAgendamentoModal onClose={() => setShowModal(false)} onSave={handleAddAgendamento} />}
    </div>
  );
}

export default Agendamentos;
