// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgOAYSgUK_e1SIF-d4hBWI8L7xDJpCiOQ",
    authDomain: "reading-list-363fd.firebaseapp.com",
    projectId: "reading-list-363fd",
    storageBucket: "reading-list-363fd.appspot.com",
    messagingSenderId: "981411442335",  
    appId: "1:981411442335:web:3a66a795b5fc336f0ffcaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

//Obtener datos desde Base de Datos
export async function getBooksFromData() {

    try {
        const response = await getDocs(collection(db, "library"))

        const originalList = []
        response.forEach((data) => originalList.push({ id: data.id, ...data.data() }))
        return originalList;
    } catch (error) {
        console.error(error);
    }

}

