import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions'
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY || "AIzaSyDrQ-tycjjDU4gek1jz07IIg30VFio-1so",
    authDomain: process.env.REACT_APP_AUTHDOMAIN || "dahabi-academy.firebaseapp.com",
    databaseURL: process.env.REACT_APP_DB || "https://dahabi-academy-default-rtdb.firebaseio.com",
    projectId: process.env.REACT_APP_PID || "dahabi-academy",
    storageBucket: process.env.REACT_APP_SB || "dahabi-academy.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_SID || "754314547074",
    appId: process.env.REACT_APP_APPID || "1:754314547074:web:cac5ac7ae057af9c0a499b",
    measurementId: process.env.REACT_APP_MID || "G-HPFRJJRZCC"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.firestore();

const storage = firebase.storage();
const functions = firebase.functions();

export {
    storage,
    functions,
    firebaseConfig,
    firebase as default
}
