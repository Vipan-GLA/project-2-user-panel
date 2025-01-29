import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPqlYJgJLXHtCnYKlJNib0xrvwQMWzFkM",
  authDomain: "adesh-project.firebaseapp.com",
  databaseURL: "https://adesh-project-default-rtdb.firebaseio.com",
  projectId: "adesh-project",
  storageBucket: "adesh-project.firebasestorage.app",
  messagingSenderId: "379111310921",
  appId: "1:379111310921:web:dbf7b5a9c723aa2e702198"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);