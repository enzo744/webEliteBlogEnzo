// ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';

const Forgot = () => {
    // Stato per gestire l'input dell'email
    const [email, setEmail] = useState('');
    // Stato per gestire il messaggio di feedback per l'utente
    const [message, setMessage] = useState('');
    // Hook per la navigazione
    const navigate = useNavigate();

    // Gestore per il submit del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Resetta il messaggio precedente
        
        // Verifica se l'email è vuota
        if (!email) {
            setMessage('Per favore, inserisci la tua email.');
            return;
        }

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            setMessage('Link per il reset della password inviato! Controlla la tua email.');
        } catch (error) {
            // Gestione degli errori specifici di Firebase
            switch (error.code) {
                case 'auth/user-not-found':
                    setMessage('Non esiste un utente con questa email.');
                    break;
                case 'auth/invalid-email':
                    setMessage('L\'indirizzo email non è valido.');
                    break;
                default:
                    setMessage('Si è verificato un errore. Per favore, riprova.');
                    console.error('Errore durante il reset della password:', error);
                    break;
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Password Dimenticata</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Indirizzo Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Reimposta Password
                        </button>
                    </div>
                </form>
                {/* Visualizza i messaggi di feedback */}
                {message && (
                    <div className="mt-4 text-center text-sm font-medium">
                        {message}
                    </div>
                )}
                {/* Link per tornare alla pagina di login */}
                <div className="mt-6 text-center text-sm">
                    <button
                        onClick={() => navigate('/login')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                    >
                        Torna al Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forgot;