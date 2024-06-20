import React from 'react';
import { Link, useLocation } from "react-router-dom";
import './Inicio.css';

function Inicio({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="inicio-container">
      <div className="sidebar">
      <Link to="/agendamentos" className="sidebar-item">Agendamentos</Link>
        <Link to="/clientes" className="sidebar-item">Clientes</Link>
        <Link to="/lojas" className="sidebar-item">Lojas</Link>
        <Link to="/servicos" className="sidebar-item">Serviços</Link>
        <Link to="/vendas" className="sidebar-item">Vendas</Link>
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
      <div className="main-content">
        <h1>Bem-vindo ao Lilly App!</h1>
        <p>Obrigado por fazer parte do Club de Estética mais completo do Brasil.</p>
        <p>Nossa empresa se dedica a oferecer excelência em todos os aspectos da beleza.</p>
        <p>Juntos, estamos transformando o cuidado estético em uma experiência única!</p>
        <div className="background-image-container">
          <img src={require('./imagem/fundo.png.png')} alt="Background" className="background-image"/>
          <img src={require('./imagem/nicolelilly.png')} alt="Nicole Lilly" className="foreground-image"/>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
