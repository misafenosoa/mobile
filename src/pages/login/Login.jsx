/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { Link, useHistory } from 'react-router-dom'; // Importez Link et useHistory depuis react-router-dom
import axios from 'axios'; // Importez axios pour effectuer des requêtes HTTP
import API_BASE_URL from '../../Config'; // Assurez-vous que API_BASE_URL pointe vers votre URL d'API

import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory(); // Initialisez le hook useHistory

  
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');

    // Redirect to the home page
  }, [history]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        utilisateur: {
          mail: email,
        },
        mdp: password,
      };

      const response = await axios.post(`${API_BASE_URL}/login`, loginData);
      const { utilisateur, tokenInformation } = response.data;

      handleAuthentication(tokenInformation.accessToken, utilisateur);
    } catch (error) {
      console.error('Login failed', error);

      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessage(error.response.data.errors[0]);
      } else {
        setErrorMessage('An error occurred during login');
      }
    }
  };

  const handleAuthentication = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    history.push('/liste'); // Rediriger l'utilisateur vers la page d'accueil
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <img className='logimg' src="R.png" alt="Your Logo" /> 
        <div className="form-group">
          <IonIcon icon={mailOutline} className="input-icon" />
          <input 
            name="email" 
            type="text" 
            className="form-control" 
            placeholder=" " 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email" className="labellogin">Adresse e-mail</label>
        </div>
        <div className="form-group">
          <IonIcon icon={lockClosedOutline} className="input-icon" />
          <IonIcon 
            icon={showPassword ? eyeOffOutline : eyeOutline} 
            className="toggle-password" 
            onClick={togglePasswordVisibility} 
          />
          <input 
            name='password' 
            type={showPassword ? "text" : "password"} 
            className="form-control" 
            placeholder=" " 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className="labellogin">Mot de passe</label>
        </div>
        <button type="submit">Login</button>
        {/* Ajoutez un lien vers la page d'inscription */}
        <Link to="/signup" className='ref'>S'inscrire</Link>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
