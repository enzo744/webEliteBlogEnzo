// import React from 'react'

import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInSuccess } from "@/redux/authSlice";
import { Button } from "./ui/button";

const GoogleAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const firebaseResponse = await auth.signInWithPopup(auth, provider);

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
            if (res.ok){
                dispatch(signInSuccess(data.user));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
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

export default GoogleAuth