import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOC4FUS6CChQjwZN_mLRLkHhEe6cNMpoQ",
  authDomain: "foodorderingapp-208f7.firebaseapp.com",
  projectId: "foodorderingapp-208f7",
  storageBucket: "foodorderingapp-208f7.firebasestorage.app",
  messagingSenderId: "205998850961",
  appId: "1:205998850961:web:d99103ff3288ce7e425030"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);