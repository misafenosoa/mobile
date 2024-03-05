import React from 'react'; // Ajoutez cette ligne pour importer React

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import Login from './login/Login';

export default function Tab1() {
  // refresh(Math.random())
  return (
    <IonPage>
      <IonContent fullscreen>
        <Login/>
      </IonContent>
    </IonPage>
  );
}