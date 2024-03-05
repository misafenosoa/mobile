/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { heart, heartOutline, checkmarkCircleOutline ,refreshCircleOutline} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios'; // Importer axios pour effectuer des requêtes HTTP
import { jwtDecode } from 'jwt-decode'
import './MesAnnonces.css'; // Importer le fichier CSS personnalisé
import API_BASE_URL from '../../Config';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const MesAnnonces = () => {
    const history = useHistory();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [annonces, setAnnonces] = useState([]); // État pour stocker les annonces
    const [userID, setUserID] = useState(null);
    const handleUnauthorized = () => {
        // Détruisez le token et redirigez vers la page de connexion
        localStorage.removeItem('accessToken');
        window.location.reload()
      };

    const fetchAnnonces = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                history.push('/login');
            } else {
                const headers = {
                    Authorization: `${accessToken}`,
                  };
                  console.log('tay')
                  console.log(headers)
                const decodedToken = jwtDecode(accessToken);
                setUserID(decodedToken.idUser);
                const response = await axios.get(`${API_BASE_URL}/annoncesHistorique/${decodedToken.idUser}`,{headers});
                setAnnonces(response.data.listAnnonces);
            }
        } catch (error) {

            console.error('Failed to fetch data:', error);
            if (error.response && error.response.status === 401) {
                handleUnauthorized()
            }
        }
    };
    
    useEffect(() => {
        fetchAnnonces();
    }, []);

    const mettreCommeVendu = async (annonceId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

                        
            const response = await axios.post(`${API_BASE_URL}/validationAnnoncesHistoriques`, {
                validationAnnoncesHistorique: {
                    annonces: {
                        idAnnonce: annonceId
                    },
                    description: "Vendue",
                    validateur: {
                        idutilisateur: userID
                    },
                    etatValidation: 30
                }
            }, {
                headers: {
                    Authorization: `${accessToken}`
                }
            });
            console.log('Annonce marquée comme vendue:', response.data);
            // Mettre à jour les annonces après avoir marqué une annonce comme vendue
            const updatedAnnonces = annonces.map(annonce => {
                if (annonce.id_annonce === annonceId) {
                    return {
                        ...annonce,
                        etatValidation: 30 // Mettre l'état de validation à 30 (vendu)
                    };
                }
                return annonce;
            });
            setAnnonces(updatedAnnonces);
        } catch (error) {
            console.error('Failed to mark annonce as vendue:', error);
        }
        setShowConfirmation(false); // Fermer la boîte de dialogue de confirmation après avoir confirmé
    };

    const handleRefresh = () => {
        fetchAnnonces();
        window.location.reload()
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonGrid>
                    
                    <IonRow>
                            <IonButton fill="clear" onClick={handleRefresh}>
                                <IonIcon icon={refreshCircleOutline} />
                            </IonButton>
                        {annonces.length === 0 ? (
                            <IonCol size="12">
                                <img src="/nodata.jpeg" alt="" />
                                <div className="center">
                                    <p> Pas d'annonce disponible pour vous</p>
                                </div>
                            </IonCol>
                        ) : (
                            annonces.map(annonce => (
                                <IonCol size="12" key={annonce.id_annonce}>
                                    <IonCard className="annonce-card">
                                        {annonce.images.length > 0 ? (
                                            <Carousel showArrows={true} showThumbs={false}>
                                                {annonce.images.map((image, index) => (
                                                    <div key={index}>
                                                        <img src={image} alt={`Image ${index + 1}`} />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        ) : (<IonImg className="annonce-image" src="https://firebasestorage.googleapis.com/v0/b/misa-misa-a92a7.appspot.com/o/images%2Fnodata.jpeg?alt=media&token=6d2c4390-bdcb-4398-a628-00389dff5933" />)}

                                        <IonCardHeader>
                                            <IonCardTitle>{annonce.nom_modele} : {annonce.prix.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <div className="etat-general">
                                                <div className="barre">
                                                    <div className="etat-actuel" style={{ width: (annonce.etat_general * 10) + '%' }}></div>
                                                    <div className="etat-total"></div>
                                                </div>
                                                <div className="note">{annonce.etat_general} / 10</div>
                                            </div>
                                            <p><strong>État validation:</strong> {annonce.etatValidation === "1" ? "En cours de validation" : annonce.etatValidation === "20" ? "En cours de vente" : "Vendu"}</p>
                                            <p><strong>Localisation:</strong> {annonce.localisation}</p>
                                            <p>{annonce.description}</p>
                                            <p><strong>Carburant:</strong> {annonce.carburant}</p>
                                            <p><strong>Marque:</strong> {annonce.marque}</p>
                                            <p>
                                                {annonce.status === 1 ? <IonIcon icon={heart} color="danger" style={{ fontSize: '30px' }}></IonIcon> : <IonIcon icon={heartOutline} style={{ fontSize: '30px', marginTop: '35px' }}></IonIcon>}
                                            </p>
                                            {annonce.etatValidation === "20" &&
                                                <IonButton fill="clear" color="success" onClick={() => setShowConfirmation(true)} className="btnV"><IonIcon icon={checkmarkCircleOutline} slot="start" />Mettre comme vendu</IonButton>}
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))
                        )}
                    </IonRow>
                </IonGrid>
                {/* Boîte de dialogue de confirmation */}
                <IonAlert
                    isOpen={showConfirmation}
                    onDidDismiss={() => setShowConfirmation(false)}
                    header={'Confirmation'}
                    message={'Êtes-vous sûr ?'}
                    buttons={[
                        {
                            text: 'Annuler',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                console.log('Annuler');
                            }
                        },
                        {
                            text: 'Oui',
                            handler: () => mettreCommeVendu(annonces.find(annonce => annonce.etatValidation === "20").id_annonce) // Trouver l'annonce avec l'étatValidation "20" et passer son ID à mettreCommeVendu
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default MesAnnonces;
