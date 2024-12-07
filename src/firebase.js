import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



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
export { auth, db, app };
