import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions'
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDrQ-tycjjDU4gek1jz07IIg30VFio-1so",
    authDomain: "dahabi-academy.firebaseapp.com",
    databaseURL: "https://dahabi-academy-default-rtdb.firebaseio.com",
    projectId: "dahabi-academy",
    storageBucket: "dahabi-academy.firebasestorage.app",
    messagingSenderId: "754314547074",
    appId: "1:754314547074:web:cac5ac7ae057af9c0a499b",
    measurementId: "G-HPFRJJRZCC"
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
    firebase as default
}
