import React, { useEffect, useState } from 'react';
import './AddClientModal.css';
import InputMask from 'react-input-mask';
import { Timestamp } from 'firebase/firestore';

function AddClientModal({ client, onClose, onSave }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [pais, setPais] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');

  useEffect(() => {
    if (client) {
      setNome(client.nome || '');
      setEmail(client.email || '');
      setCelular(client.celular || '');
      setDataNascimento(client.dataNascimento || '');
      setCpf(client.cpf || '');
      if (client.endereco) {
        setPais(client.endereco.pais || '');
        setCep(client.endereco.cep || '');
        setEndereco(client.endereco.endereco || '');
        setNumero(client.endereco.numero || '');
        setComplemento(client.endereco.complemento || '');
      }
    }
  }, [client]);
  
  const handleSubmit = () => {
    const clientData = {
      nome, email, celular, dataNascimento, cpf,
      endereco: {
        pais, cep, endereco, numero, complemento
      },
      isActive: true,
      createdAt: client ? client.createdAt : Timestamp.now()
    };
    onSave(clientData);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{client ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
        <h3>Informações Básicas</h3>
        <label>Nome:<input type="text" value={nome} onChange={e => setNome(e.target.value)} /></label>
        <label>E-mail:<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Celular:<InputMask mask="(99) 99999-9999" value={celular} onChange={e => setCelular(e.target.value)} /></label>
        <label>Data de Nascimento:<input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} /></label>
        <label>CPF:<InputMask mask="999.999.999-99" value={cpf} onChange={e => setCpf(e.target.value)} /></label>
        <label>País:<input type="text" value={pais} onChange={e => setPais(e.target.value)} /></label>
        <label>CEP:<InputMask mask="99999-999" value={cep} onChange={e => setCep(e.target.value)} /></label>
        <label>Endereço:<input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} /></label>
        <label>Número:<input type="text" value={numero} onChange={e => setNumero(e.target.value)} /></label>
        <label>Complemento:<input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} /></label>
        <button className="save-button" onClick={handleSubmit}>Salvar</button>
        <button className="back-button" onClick={onClose}>Voltar</button>
      </div>
    </div>
  );
}

export default AddClientModal;
