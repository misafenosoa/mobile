import React, { useState , useEffect} from 'react';
import './createAd.css';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Importez useHistory pour la navigation
import API_BASE_URL from '../../Config';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importez les fonctions de stockage Firebase
import { storage } from '../../Firebase';
import ImageCompressor from 'image-compressor.js';
import { refreshCircleOutline } from 'ionicons/icons';



export default function CreateAd() {

    const [step, setStep] = useState(1);
    const [model, setModel] = useState('');
    const [modelOptions, setModelOptions] = useState([]);
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleRefresh = () => {
        window.location.reload()
    };

    useEffect(() => {

        console.log(Math.random())
        // Vérifier si le token est présent dans le localStorage
        if (!localStorage.getItem('accessToken')) {
            // Rediriger vers la page de connexion si le token est absent
            history.push('/login');
        } 
    }, []);

    useEffect(() => {
        console.log('ouh')
        // Vérifier si le token est présent dans le localStorage
        if (!localStorage.getItem('accessToken')) {
            // Rediriger vers la page de connexion si le token est absent
            history.push('/login');
        } 
    }, [history]);
    
    useEffect(() => {
        // Code à exécuter lorsque la page est chargée
        const fetchModelOptions = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                history.push('/login');
                return; // Arrêtez l'exécution de la fonction fetchModelOptions si le token n'existe pas
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/modeles`);
                setModelOptions(response.data.listModeles);
            } catch (error) {
                console.error('Failed to fetch model options:', error);
                setErrorMessage('Erreur lors du chargement des options de modèle.');
            }
        };
    
        fetchModelOptions();
    }, []); // Utilisez une dépendance vide pour exécuter le code une seule fois lors du montage initial du composant
    

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePhotoChange = (e) => {
        const selectedPhotos = Array.from(e.target.files);
        if (selectedPhotos.length + photos.length <= 3) {
            setPhotos([...photos, ...selectedPhotos]);
        } else {
            setErrorMessage('Vous ne pouvez pas télécharger plus de 3 images.');
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const uploadImages = async () => {
        const uploadedImageUrls = [];

        for (const photo of photos) {
            try {
                const imageCompressor = new ImageCompressor();
                const compressedPhoto = await imageCompressor.compress(photo, {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 1920
                });

                const imageRef = ref(storage, `images/${photo.name}`);
                await uploadBytes(imageRef, compressedPhoto);
                const imageUrl = await getDownloadURL(imageRef);
                uploadedImageUrls.push(imageUrl);
            } catch (error) {
                console.error('Erreur lors du téléchargement de l\'image:', error);
                setErrorMessage('Erreur lors du téléchargement des images.');
            }
        }

        return uploadedImageUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            const uploadedImageUrls = await uploadImages();
            const userID = jwtDecode(localStorage.getItem('accessToken')).idUser;
            console.log({
                headers: {
                    Authorization: `${accessToken}`
                }
            })
            const response = await axios.post(`${API_BASE_URL}/annonces`, {
                annonces: {
                    modeles: {
                        idModeles: modelOptions.find(option => option.nomModele === model).idModeles
                    },
                    utilisateur: {
                        idutilisateur: userID
                    },
                    etatGeneral: rating,
                    localisation: location,
                    prix: parseFloat(price),
                    description: description
                }
            },{
                headers: {
                    Authorization: `${accessToken}`
                }
            });
        
            // Récupérez l'ID de l'annonce créée à partir de la réponse
            const annonceID = response.data.annonces.idAnnonce;
        
            // Deuxième requête pour ajouter des photos à l'annonce
            const response2 = await axios.post(`${API_BASE_URL}/photoannonces`, {
                photos: uploadedImageUrls,
                annonceID: annonceID
            });


            console.log(
                {
                    photos: uploadedImageUrls,
                    annonceID: response.data.annonces.idAnnonce // Utilisez l'ID de l'annonce créée
                }
            )
            console.log(response)
            console.log('Annonce créée avec succès:', response2);
            history.push('/liste');
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
            setErrorMessage('Erreur lors de la création de l\'annonce. Veuillez réessayer.');

        }
    };
    return (
        <IonPage>
        <IonContent fullscreen>
            <IonButton fill="clear" onClick={handleRefresh}>
                <IonIcon icon={refreshCircleOutline} />
            </IonButton>
            <div className="container">

                <form className="form">
                {step === 1 && (
                            <>
                                <img className='logimg' src="R.png" alt="Your Logo" />
                                <div className="form-group">
                                    <select id="model" name="model" value={model} onChange={handleModelChange}>
                                        <option value="">Choix du modèle</option>
                                        {modelOptions.map(option => (
                                            <option key={option.idModeles} value={option.nomModele}>{option.nomModele}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input id="price" name="price" type="number" min="0" value={price} onChange={handlePriceChange} />
                                    <label htmlFor="price" className='lab'>Prix (en MGA):</label>
                                </div>
                                <div className="navcreate">
                                    <span className="spacer"></span>
                                    <button type="submit" className='navbtn' onClick={handleNext}>Suivant</button>
                                </div>
                            </>
                )}
                    {step === 2 && (
                        <>
                            <img className='logimg' src="R.png" alt="Your Logo" /> 
                            <div className="form-group">
                                <input id="location" name="location" type="text" value={location} onChange={handleLocationChange} />
                                <label htmlFor="location" className='lab'>Localisation de la voiture:</label>
                            </div>
                            <div className="form-group">
                                <input id="rating" name="rating" type="number" min="0" max="10" value={rating} onChange={handleRatingChange} />
                                <label htmlFor="rating" className='lab'>Note sur 10 de la voiture:</label>
                            </div>
                            <div className="navcreate">
                                <button type="button" className='navbtn1' onClick={handlePrevious}>Retour</button>
                                <span className="spacer"></span>
                                <button type="submit" className='navbtn' onClick={handleNext}>Suivant</button>
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <img className='logimg' src="R.png" alt="Your Logo" /> 
                            <div className="form-group">
                                <label htmlFor="photos" className="filelabel">Choix de photos:</label>
                                <input type="file" id="photos" name="photos" multiple className="file-input" onChange={handlePhotoChange} />
                            </div>
                            <div className="file-preview">
                                {photos.map((photo, index) => (
                                    <div key={index} className="file-preview-item">
                                        <img src={URL.createObjectURL(photo)} alt={`Photo ${index}`} />
                                        <button type="button" onClick={() => handleRemovePhoto(index)}>X</button>
                                    </div>
                                ))}
                            </div>
                            <div className="navcreate">
                                <button type="button" className='navbtn1' onClick={handlePrevious}>Retour</button>
                                <span className="spacer"></span>
                                <button type="submit" className='navbtn' onClick={handleNext}>Suivant</button>
                            </div>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <img className='logimg' src="R.png" alt="Your Logo" /> 
                            <div className="form-group">
                                <textarea id="description" name="description" value={description} onChange={handleDescriptionChange}></textarea>
                                <label >Description supplémentaire de la voiture:</label>
                            </div>
                            <div className="navcreate">
                                <button type="button" className='navbtn1' onClick={handlePrevious}>Retour</button>
                                <span className="spacer"></span>
                                <button type="submit" className='navbtn' onClick={handleSubmit}>Soumettre</button>
                            </div>
                        </>
                    )}
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </IonContent>
        </IonPage>


    );
}
