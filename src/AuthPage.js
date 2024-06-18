import React, { useState } from 'react';
import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import { getAuth } from "firebase/auth";

function AuthPage() {
  const [isRegister, setRegister] = useState(false);
  const auth = getAuth();

  const switchPage = () => {
    setRegister(!isRegister);
  };

  const handleLogin = (userCredential) => {
    // Handle what should happen after the user logs in
    console.log("User logged in with email: ", userCredential.user.email);
  };

  const handleRegister = (userCredential) => {
    // Handle what should happen after the user registers
    console.log("User registered with email: ", userCredential.user.email);
    // After successful registration, you might want to switch back to the login page
    setRegister(false);
  };

  return isRegister ? <RegisterPage onRegister={handleRegister} auth={auth} /> : <LoginPage onLogin={handleLogin} onSwitch={switchPage} auth={auth} />;
}

export default AuthPage;
