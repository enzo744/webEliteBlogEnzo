// GoogleAuth.jsx
import { useEffect } from 'react';
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { signInSuccess } from "@/redux/authSlice";
import { Button } from "./ui/button";

const GoogleAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Gestiamo il risultato del reindirizzamento all'avvio dell'app
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                // Tenta di ottenere il risultato del reindirizzamento
                const result = await getRedirectResult(auth);
                if (result) {
                    // Se il reindirizzamento ha avuto successo, ottieni l'utente
                    const firebaseResponse = result;
                    
                    // Invia i dati dell'utente al tuo backend
                    const res = await fetch('https://webeliteblogenzo.onrender.com/api/v1/user/google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: firebaseResponse.user.displayName,
                            email: firebaseResponse.user.email,
                        }),
                    });

                    const data = await res.json();
                    
                    if (res.ok) {
                        dispatch(signInSuccess(data));
                        navigate('/');
                    }
                }
            } catch (error) {
                console.log("Errore durante l'autenticazione con Google:", error);
                // Puoi aggiungere qui la gestione degli errori per l'utente, ad esempio con una 'toast'
            }
        };

        handleRedirectResult();
    }, [auth, dispatch, navigate]);

    // Funzione per avviare il reindirizzamento
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.log("Errore durante il reindirizzamento:", error);
        }
    }

    return (
        <div>
            <Button
                type="button"
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleGoogleClick}
            >
                Accedi con Google
            </Button>
        </div>
    )
}

export default GoogleAuth;
