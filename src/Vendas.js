import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase';
import './Vendas.css';

function Vendas({ onLogout }) {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      const q = query(collection(db, "Vendas"), orderBy("createdAt", "desc"));
      try {
        const querySnapshot = await getDocs(q);
        const vendasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendas(vendasData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
        setLoading(false);
      }
    };

    fetchVendas();
  }, []);

  return (
    <div className="inicio-container">
      <div className="sidebar">
      <Link to="/agendamentos" className="sidebar-item">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/servicos" className="sidebar-item">Serviços</Link>
        <Link to="/vendas" className="sidebar-item active">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <button onClick={() => navigate('/vendas/step1')} className="start-sales-button">Iniciar Nova Venda</button>
        <h2>Lista de Vendas</h2>
        {loading ? (
          <p>Carregando vendas...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviços</th>
                <th>Loja</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(venda => (
                <tr key={venda.id}>
                  <td>{venda.cliente.nome}</td>
                  <td>{venda.servicos.map(servico => servico.nome).join(', ')}</td>
                  <td>{venda.loja.nome}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Vendas;
