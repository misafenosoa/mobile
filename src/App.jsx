// import React, { useEffect, useState } from 'react';
import React from 'react'; // Ajoutez cette ligne pour importer React

import { Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Tab1 from './pages/Tab1';
import { personCircleOutline, personAddOutline, addCircleOutline, listOutline ,logOut } from 'ionicons/icons'; // Nouveaux icônes importés


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Signup from './pages/signup/signup';
import CreateAd from './pages/createAd/CreateAd';
import MesAnnonces from './pages/mesAnnonces/MesAnnonces';

setupIonicReact();

// const [connection, setConnection] = useState(true);

    // useEffect(() => {
    //     // Mettez ici la logique pour rafraîchir la page
    //     console.log('Connection changed, refreshing page...');
    //     window.location.reload(); // Actualiser la page
    // }, [connection]);


const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login">
            {/* refresh={setConnection} */}
            <Tab1 />
          </Route>
          <Route exact path="/">
            <Tab1 />
          </Route>
          <Route path="/create">
            <CreateAd/>
          </Route>
          <Route exact path="/signup">
            <Signup/>
          </Route>
          <Route path="/liste">
            <MesAnnonces/>
          </Route>
          <Route path="/logout">
            <Tab1/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" >
          <IonTabButton tab="tab1" href="/login">
            <IonIcon aria-hidden="true" icon={personCircleOutline} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/signup">
            <IonIcon aria-hidden="true" icon={personAddOutline} />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/create">
            <IonIcon aria-hidden="true" icon={addCircleOutline} />
          </IonTabButton>
          <IonTabButton tab='tab4' href="/liste">
            <IonIcon aria-hidden="true" icon={listOutline} />
          </IonTabButton>
          <IonTabButton tab='tab5'  href="/logout">
            <IonIcon aria-hidden="true" icon={logOut} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
