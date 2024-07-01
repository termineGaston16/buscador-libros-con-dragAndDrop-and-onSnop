// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, doc, setDoc, updateDoc, deleteDoc, onSnapshot  } from "firebase/firestore";
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

// Función para obtener datos de la colección "library" con listener en tiempo real
export function getBooksFromData(callback) {
    return onSnapshot(collection(db, "library"), snapshot => {
        const originalList = [];
        snapshot.forEach(doc => {
            originalList.push({ id: doc.id, ...doc.data() });
        });
        callback(originalList);
    });
}

// Función para obtener datos de la colección "readBooks" con listener en tiempo real
export function getListReading(callback) {
    return onSnapshot(collection(db, "readBooks"), snapshot => {
        const originalList = [];
        snapshot.forEach(doc => {
            originalList.push({ id: doc.id, ...doc.data() });
        });
        callback(originalList);
    });
}


// Función para guardar cambios en la base de datos de Firestore
export async function saveBookChanges(book) {
    const { id, ...data } = book; // Separa el id de los datos del libro

    try {
        // Si el libro tiene un id, se actualiza el documento existente
        if (id) {
            const bookRef = doc(db, "library", id);
            await updateDoc(bookRef, data);
        } else {
            // Si el libro no tiene un id, se crea un nuevo documento
            const bookRef = doc(collection(db, "library"));
            await setDoc(bookRef, data);
        }
    } catch (error) {
        console.error("Error al guardar los cambios en Firestore:", error);
    }
}

// Función para guardar un libro en la lista de libros leídos en Firestore
export async function addBookToReadBooks(book) {
    try {
        // Creamos una referencia a la colección "readBooks" en Firestore
        const readBooksRef = collection(db, "readBooks");

        // Creamos un nuevo documento en la colección "readBooks" y guardamos el libro
        const docRef = doc(readBooksRef);
        await setDoc(docRef, book);
        
        console.log("Libro añadido a la colección readBooks:", book);
    } catch (error) {
        console.error("Error al agregar el libro a la colección readBooks en Firestore:", error);
    }
}

// Función para eliminar un libro de la colección "readBooks" en Firestore
export async function deleteBookFromReadBooks(productId) {
    try {
        // Realizamos una consulta para encontrar el documento que contiene el producto con el productId
        const querySnapshot = await getDocs(collection(db, "readBooks"));
        querySnapshot.forEach(async (doc) => {
            const data = doc.data();
            if (data.id === productId) {
                // Encontramos el documento que contiene el producto con el productId, ahora lo eliminamos
                await deleteDoc(doc.ref);
                console.log("Libro eliminado de la colección readBooks con productId:", productId);
            }
        });
    } catch (error) {
        console.error("Error al eliminar el libro de la colección readBooks en Firestore:", error);
    }
}


