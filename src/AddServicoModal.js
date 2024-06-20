import React, { useState, useEffect } from 'react';
import './AddServicoModal.css';

function AddServicoModal({ servico, onClose, onSave }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [regiaoCorporal, setRegiaoCorporal] = useState('');

  useEffect(() => {
    if (servico) {
      setNome(servico.nome);
      const precoFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(servico.preco);
      setPreco(precoFormatado);
      setRegiaoCorporal(servico.regiaoCorporal);
    }
  }, [servico]);

  const handleSave = () => {
    const servicoData = {
      nome,
      preco: parseFloat(preco.replace('R$', '').replace(/\./g, '').replace(',', '.')),
      regiaoCorporal,
      isActive: servico ? servico.isActive : true,
      createdAt: servico ? servico.createdAt : new Date(),
    };
    onSave(servicoData);
  };

  const handlePrecoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = (parseInt(value, 10) / 100).toFixed(2).toString();
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setPreco(`R$ ${value}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{servico ? 'Editar Serviço' : 'Adicionar Serviço'}</h2>
        <input
          type="text"
          placeholder="Nome do Serviço"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="modal-input"
        />
        <input
          type="text"
          placeholder="Preço"
          value={preco}
          onChange={handlePrecoChange}
          className="modal-input"
        />
        <input
          type="text"
          placeholder="Região Corporal"
          value={regiaoCorporal}
          onChange={(e) => setRegiaoCorporal(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">Cancelar</button>
          <button onClick={handleSave} className="save-button">{servico ? 'Salvar' : 'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}

export default AddServicoModal;
