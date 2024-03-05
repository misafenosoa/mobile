import React, { useState } from 'react';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, chevronBackOutline } from 'ionicons/icons';
import { Link, useHistory } from 'react-router-dom'; // Importez Link depuis react-router-dom

import './signup.css';
import axios from 'axios';
import API_BASE_URL from '../../Config'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // État pour suivre l'étape actuelle du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: ''
  });

  const history = useHistory()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToStep1 = () => {
    setStep(1); // Revenir à l'étape 1
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2); // Passer à l'étape suivante
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    try {
      // Envoyer les données du formulaire au backend
      const response = await axios.post(`${API_BASE_URL}/register`, {
        utilisateur: {
          mail: formData.email,
          prenom: formData.firstName,
          nom: formData.lastName,
          birthday: formData.dateOfBirth,
          hierarchie: 1 // Vous devrez ajuster cela selon vos besoins
        },
        mdp: formData.password
      });
  
      history.push('/login');
      // Traiter la réponse du backend
      console.log('Inscription réussie:', response.data);
      // Rediriger l'utilisateur vers une page de confirmation ou une autre page appropriée
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        // setErrorMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container">
            <img src="2.png" alt="Your Logo" className='logoup'/> 
          {step === 1 ? (
            <form className="form" onSubmit={handleSubmitStep1}>
              <div className="form-group">
                <input 
                  name="lastName" 
                  type="text" 
                  className="form-control" 
                  placeholder=" " 
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <label htmlFor="lastName" className='labellogin'>Nom</label>
              </div>
              <div className="form-group">
                <input 
                  name="firstName" 
                  type="text" 
                  className="form-control" 
                  placeholder=" " 
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <label htmlFor="firstName" className='labellogin'>Prénom</label>
              </div>
              <div className="form-group">
                <input 
                  name="dateOfBirth" 
                  type="date" 
                  className="form-control" 
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <label htmlFor="dateOfBirth" className='labellogin'>Date de naissance</label>
              </div>
              <button type="submit" className='btnup'>Continuer</button>
              {/* Ajoutez un lien vers la page de connexion */}
              <Link to="/login" className='ref'>Se connecter</Link>
            </form>
          ) : (
            <form className="form" onSubmit={handleSubmitStep2}>
              <div className="form-group">
                <IonIcon icon={mailOutline} className="input-icon" />
                <input 
                  name="email" 
                  type="text" 
                  className="form-control" 
                  placeholder=" " 
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email" className='labellogin'>Adresse e-mail</label>
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
                  value={formData.password}
                  onChange={handleChange}
                />
                <label htmlFor="password" className='labellogin'>Mot de passe</label>
              </div>
              <div className="navcreate">
                <button type="button" className='navbtn1' onClick={handleBackToStep1}>Retour</button>
                <span className="spacer"></span>
                <button type="submit" className='navbtn'>Soumettre</button>
              </div>
              {/* Ajoutez un lien vers la page de connexion */}
              <Link to="/login" className='ref'>Se connecter</Link>
            </form>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
