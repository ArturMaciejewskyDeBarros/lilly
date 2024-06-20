import React, { useState, useEffect } from 'react';
import './AddAgendamentoModal.css';
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from './firebase';

function AddAgendamentoModal({ onClose, onSave }) {
  const [clientes, setClientes] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedClienteNome, setSelectedClienteNome] = useState('');
  const [selectedLoja, setSelectedLoja] = useState('');
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedData, setSelectedData] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');
  const [outroServico, setOutroServico] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const clientesSnapshot = await getDocs(collection(db, "Clientes"));
      const lojasSnapshot = await getDocs(collection(db, "Lojas"));
      const servicosSnapshot = await getDocs(collection(db, "Servicos"));

      setClientes(clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLojas(lojasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setServicos(servicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
    }
  };

  const handleSave = () => {
    const agendamento = {
      cliente: { id: selectedCliente, nome: selectedClienteNome },
      loja: lojas.find(l => l.id === selectedLoja),
      servico: selectedServico === 'outro' ? { nome: outroServico } : servicos.find(s => s.id === selectedServico),
      data: Timestamp.fromDate(new Date(`${selectedData}T${selectedHorario}:00`)),
      horario: selectedHorario,
      createdAt: new Date(),
    };
    onSave(agendamento);
  };

  const handleClienteChange = (e) => {
    setSelectedClienteNome(e.target.value);
  };

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente.id);
    setSelectedClienteNome(cliente.nome);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Agendamento</h2>
        <div className="form-group">
          <label>Cliente</label>
          <input
            type="text"
            placeholder="Digite o nome do cliente"
            value={selectedClienteNome}
            onChange={handleClienteChange}
            className="search-input"
          />
          {selectedClienteNome && (
            <div className="client-options">
              {clientes
                .filter(cliente => cliente.nome.toLowerCase().includes(selectedClienteNome.toLowerCase()))
                .map(cliente => (
                  <div key={cliente.id} onClick={() => handleClienteSelect(cliente)}>
                    {cliente.nome}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Loja</label>
          <select value={selectedLoja} onChange={(e) => setSelectedLoja(e.target.value)}>
            <option value="">Selecione uma loja</option>
            {lojas.map(loja => (
              <option key={loja.id} value={loja.id}>{loja.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Serviço</label>
          <select value={selectedServico} onChange={(e) => setSelectedServico(e.target.value)}>
            <option value="">Selecione um serviço</option>
            {servicos.map(servico => (
              <option key={servico.id} value={servico.id}>{servico.nome}</option>
            ))}
            <option value="outro">Outro</option>
          </select>
          {selectedServico === 'outro' && (
            <input
              type="text"
              placeholder="Descreva o serviço"
              value={outroServico}
              onChange={(e) => setOutroServico(e.target.value)}
            />
          )}
        </div>
        <div className="form-group">
          <label>Data</label>
          <input
            type="date"
            value={selectedData}
            onChange={(e) => setSelectedData(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="form-group">
          <label>Horário</label>
          <input
            type="time"
            value={selectedHorario}
            onChange={(e) => setSelectedHorario(e.target.value)}
          />
        </div>
        <button onClick={handleSave} className="save-button">Salvar</button>
        <button onClick={onClose} className="close-button">Fechar</button>
      </div>
    </div>
  );
}

export default AddAgendamentoModal;
