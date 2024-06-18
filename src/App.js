import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Certifique-se de importar signOut
import AuthPage from "./AuthPage";
import Inicio from "./Inicio";
import Clientes from "./Clientes";
import Lojas from "./Lojas";
import Vendas from "./Vendas";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null); // Assegura que o estado do usuário é resetado
    }).catch((error) => {
      console.error("Erro ao fazer logout: ", error);
    });
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={user ? <Navigate replace to="/inicio" /> : <AuthPage />} />
          <Route path="/clientes" element={user ? <Clientes onLogout={handleLogout} /> : <Navigate replace to="/login" />} />
          <Route path="/lojas" element={user ? <Lojas /> : <Navigate replace to="/login" />} />
          <Route path="/vendas" element={user ? <Vendas /> : <Navigate replace to="/login" />} />
          <Route path="/inicio" element={user ? <Inicio onLogout={handleLogout} /> : <Navigate replace to="/login" />} />
          <Route path="*" element={<Navigate replace to="/inicio" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
