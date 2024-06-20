import React, { useState, useEffect } from 'react';
import './Lojas.css';
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"; 
import { db } from './firebase';
import AddLojaModal from './AddLojaModal';

function Lojas({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [lojas, setLojas] = useState([]);
  const [lojaToEdit, setLojaToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLojas = async () => {
      setLoading(true);
      const q = query(collection(db, "Lojas"), orderBy("createdAt", "desc"), limit(25));
      try {
        const querySnapshot = await getDocs(q);
        const lojasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLojas(lojasData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
        setLoading(false);
      }
    };

    fetchLojas();
  }, []);

  const saveLoja = async (lojaData) => {
    if (lojaToEdit) {
      const lojaRef = doc(db, "Lojas", lojaToEdit.id);
      await updateDoc(lojaRef, lojaData);
    } else {
      await addDoc(collection(db, "Lojas"), lojaData);
    }
    setShowModal(false);
    setLojaToEdit(null);
    await fetchLojas();
  };

  const editLoja = (loja) => {
    setLojaToEdit(loja);
    setShowModal(true);
  };

  const softDeleteLoja = async (id) => {
    const lojaRef = doc(db, "Lojas", id);
    await updateDoc(lojaRef, { isActive: false });
    await fetchLojas();
  };

  const fetchLojas = async () => {
    setLoading(true);
    const q = query(collection(db, "Lojas"), orderBy("createdAt", "desc"), limit(25));
    try {
      const querySnapshot = await getDocs(q);
      const lojasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLojas(lojasData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      setLoading(false);
    }
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
      <Link to="/agendamentos" className="sidebar-item">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item active">Lojas</Link>
        <Link to="/servicos" className="sidebar-item">Serviços</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <div className="loja-header">
          <input
            type="text"
            placeholder="Nome, Estado ou CNPJ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => { setLojaToEdit(null); setShowModal(true); }} className="add-loja-button">Adicionar Loja</button>
        </div>
        <div className="loja-list">
          {loading ? (
            <p>Carregando lojas...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Estado</th>
                  <th>CNPJ</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lojas.filter(loja => 
                  loja.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  loja.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  loja.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(loja => (
                  <tr key={loja.id}>
                    <td>{loja.nome}</td>
                    <td>{loja.estado}</td>
                    <td>{loja.cnpj}</td>
                    <td>
                      <span className="action-icons" onClick={() => editLoja(loja)}>📝</span>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && <AddLojaModal loja={lojaToEdit} onClose={() => setShowModal(false)} onSave={saveLoja} />}
    </div>
  );
}

export default Lojas;
