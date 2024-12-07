import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './Signup.css';

// Remplacez par votre configuration Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8-mPm6bCYSFbHej_D2khf8tmypuaBC8M",
  authDomain: "marketplace-99bea.firebaseapp.com",
  projectId: "marketplace-99bea",
  storageBucket: "marketplace-99bea.firebasestorage.app",
  messagingSenderId: "796246689831",
  appId: "1:796246689831:web:d548006be9021b31c06602"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [error, setError] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'utilisateur'), {
        uid: user.uid,
        email: email,
        nom: nom,
        prenom: prenom,
        dateDeNaissance: dateDeNaissance
      });

      console.log("User signed up:", user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
    
      <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
        <div>
          <input type="text" placeholder='Nom' value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <input type="text" placeholder='Prénom' value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>
        <div>
          <input type="date" placeholder='Date de naissance' value={dateDeNaissance} onChange={(e) => setDateDeNaissance(e.target.value)} required />
        </div>
        <div>
          <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <input type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <input
            label="Image"
            placeholder="Choose image"
            accept="image/png,image/jpeg"
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </div>
        <button  className='btn-sginup' type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignUp;

