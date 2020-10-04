import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDoufc5PY46qid1F5QsMponYWnFqyJ6SFM",
    authDomain: "instagram-clone-52333.firebaseapp.com",
    databaseURL: "https://instagram-clone-52333.firebaseio.com",
    projectId: "instagram-clone-52333",
    storageBucket: "instagram-clone-52333.appspot.com",
    messagingSenderId: "831981178252",
    appId: "1:831981178252:web:823f519a618719777cdaa9"
};

export default firebase.initializeApp(firebaseConfig);