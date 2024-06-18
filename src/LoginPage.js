import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import "./LoginPage.css";
import { auth } from "./firebase.js";
import logo from "./imagem/logo.png.png"; // Importando a imagem

function LoginPage({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Limpa o erro anterior antes de tentar novamente
    await setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          // Usuário logado
          onLogin();
        } else {
          throw new Error("Os detalhes do usuário não estão disponíveis após o login.");
        }
      })
      .catch((error) => {
        // Ocorreu algum outro erro ao entrar
        setError("Erro ao entrar: " + error.message);
      });
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-logo" />
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="input-field"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}


export default LoginPage;
