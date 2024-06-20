import React, { useEffect, useState } from 'react';
import './AddLojaModal.css';
import InputMask from 'react-input-mask';
import { Timestamp } from 'firebase/firestore';

function AddLojaModal({ loja, onClose, onSave }) {
  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState('');
  const [cnpj, setCnpj] = useState('');

  useEffect(() => {
    if (loja) {
      setNome(loja.nome || '');
      setEstado(loja.estado || '');
      setCnpj(loja.cnpj || '');
    }
  }, [loja]);
  
  const handleSubmit = () => {
    const lojaData = {
      nome, estado, cnpj,
      isActive: true,
      createdAt: loja ? loja.createdAt : Timestamp.now()
    };
    onSave(lojaData);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{loja ? 'Editar Loja' : 'Adicionar Loja'}</h2>
        <label>Nome da Loja:<input type="text" value={nome} onChange={e => setNome(e.target.value)} /></label>
        <label>Estado:<input type="text" value={estado} onChange={e => setEstado(e.target.value)} /></label>
        <label>CNPJ:<InputMask mask="99.999.999/9999-99" value={cnpj} onChange={e => setCnpj(e.target.value)} /></label>
        <button className="save-button" onClick={handleSubmit}>Salvar</button>
        <button className="cancel-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default AddLojaModal;
