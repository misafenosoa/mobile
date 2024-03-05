import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import CreateAd from './createAd/CreateAd';

export default function Tab1() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <CreateAd/>
      </IonContent>
    </IonPage>
  );
}