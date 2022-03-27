// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4HMrvxUe-9-DGERyjhI6bHe0gtu_wcSg",
    authDomain: "metasurf-11346.firebaseapp.com",
    projectId: "metasurf-11346",
    storageBucket: "metasurf-11346.appspot.com",
    messagingSenderId: "387962052258",
    appId: "1:387962052258:web:cd9d4c7190c5e4010741fb"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
// Initialize Firebase