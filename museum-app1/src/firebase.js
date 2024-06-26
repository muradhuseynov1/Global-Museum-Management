import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBQhTPVuMVQ2uUx7yn_u5LpLV2D1e6lLN8",
  authDomain: "museum-management-app.firebaseapp.com",
  projectId: "museum-management-app",
  storageBucket: "museum-management-app.appspot.com",
  messagingSenderId: "744465169417",
  appId: "1:744465169417:web:367635a2b0c71cc97fccd8",
  measurementId: "G-04CCYH2JJY"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app); 
const storage = getStorage(app);  
const functions = getFunctions(app);

export { app, auth, firestore, database, storage, functions };