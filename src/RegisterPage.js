import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./RegisterPage.css";
import { auth } from "./firebase.js";

function RegisterPage({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // New user created
        onRegister();
      })
      .catch((error) => {
        // Some error occurred while creating the user
        setError("Erro ao criar usuário: " + error.message);
      });
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <h1 className="register-heading">Regras para cadastro:</h1>
        <p className="registration-instructions">
          Nome + sobrenome@xvolt.com <br />
          (Senha de no mínimo 6 dígitos) <br />
          Exemplo: <br />
          Arturbarros@xvolt.com
        </p>
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
        <button type="submit" className="register-button">
          Registrar
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
