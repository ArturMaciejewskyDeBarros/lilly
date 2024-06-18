// Inicio.js
import React from 'react';
import './Inicio.css';
import { Link } from "react-router-dom";  // Importação do Link do react-router-dom

// Supondo que a função onLogout passe a propriedade corretamente
function Inicio({ onLogout }) {
  return (
    <div className="inicio-container">
      <div className="sidebar">
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <h1>Bem-vindo ao Lilly!</h1>
      </div>
    </div>
  );
}


export default Inicio;
