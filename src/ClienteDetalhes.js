import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from './firebase';
import './ClienteDetalhes.css';

function ClienteDetalhes({ client, onClose }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true);
      const q = query(collection(db, "Vendas"), where("cliente.id", "==", client.id));
      try {
        const querySnapshot = await getDocs(q);
        let comprasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        comprasData = comprasData.reverse(); // Invertendo a ordem dos dados
        setCompras(comprasData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar compras:", error);
        setLoading(false);
      }
    };

    fetchCompras();
  }, [client.id]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalhes do Cliente</h2>
        {loading ? (
          <p>Carregando compras...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Serviços</th>
                <th>Data</th>
                <th>Forma de Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(compra => (
                <tr key={compra.id}>
                  <td>{compra.servicos.map(servico => <div key={servico.id}>{servico.nome}</div>)}</td>
                  <td>{new Date(compra.createdAt.toDate()).toLocaleDateString()}</td>
                  <td>{compra.metodoPagamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={onClose} className="close-button">Fechar</button>
      </div>
    </div>
  );
}

export default ClienteDetalhes;
