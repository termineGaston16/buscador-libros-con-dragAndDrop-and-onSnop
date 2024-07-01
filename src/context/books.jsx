import { createContext, useEffect, useState } from "react";
import { getBooksFromData, saveBookChanges, addBookToReadBooks, getListReading, deleteBookFromReadBooks } from "../firebase/firebase"

export const BooksContext = createContext();

export function BooksProvider({ children }) {
    const [listOfBooks, setListOfBooks] = useState(null)
    const [readingList, setReadingList] = useState([])
    const [filter, setFilter] = useState({ genderDefault: "all" })

    useEffect(() => {
        
        // Suscripción a cambios en la colección "library"
        const unsubscribeBooks = getBooksFromData(updatedBooks => {
            const listMapped = updatedBooks.map(book => ({
                id: book.id,
                isbn: book.ISBN,
                author: {
                    name: book.author.name,
                    otherBooks: book.author.otherBooks
                },
                cover: book.cover,
                gender: book.genre,
                pages: book.pages,
                synopsis: book.synopsis,
                title: book.title,
                reading: book.reading || false
            }));
            setListOfBooks(listMapped);
        });

        // Suscripción a cambios en la colección "readBooks"
        const unsubscribeReadingList = getListReading(updatedReadingList => {
            const listMapped = updatedReadingList.map(book => ({
                id: book.id,
                isbn: book.ISBN,
                author: {
                    name: book.author.name,
                    otherBooks: book.author.otherBooks
                },
                cover: book.cover,
                gender: book.genre,
                pages: book.pages,
                synopsis: book.synopsis,
                title: book.title,
                reading: book.reading || false
            }));
            setReadingList(listMapped);
        });

        // Devolver funciones de desuscripción para limpiar cuando el componente se desmonte
        return () => {
            unsubscribeBooks();
            unsubscribeReadingList();
        };
    }, []); // Ejecutar una sola vez al montar el componente

    //Filtrar Lista
    const filterList = () => {
        return listOfBooks.filter(book => {
            return filter.genderDefault === "all" || (book.gender === filter.genderDefault && !book.reading);
        })
    }


    //Almacenar un libro en la lista de lectura
    const storeABook = (book) => {
        if (book.reading) return alert("Este libro ya está almacenado");

        setReadingList(prevList => [...prevList, { ...book, reading: true }])
        addBookToReadBooks({ ...book, reading: true })

        const listOrigin = listOfBooks;
        const indexOfBook = listOrigin.findIndex(bookIn => bookIn.id === book.id)

        const newList = structuredClone(listOrigin)
        newList[indexOfBook].reading = true;
        saveBookChanges(newList[indexOfBook])

        return setListOfBooks(newList)
    }

    //Desalmacenar un libro en la lista de lectura
    const unstoreABook = (book) => {
        const listbooks = listOfBooks;
        const listreading = readingList;

        const newListReading = listreading.filter(booksIn => booksIn.id !== book.id)
        setReadingList(newListReading)
        deleteBookFromReadBooks(book.id)

        const indexOfBook = listbooks.findIndex(bookIn => bookIn.id === book.id)
        const newListOfBook = structuredClone(listbooks)
        newListOfBook[indexOfBook].reading = false;
        saveBookChanges(newListOfBook[indexOfBook])
        setListOfBooks(newListOfBook)
        return;
    }

    //Obtener una lista de los géneros
    const getListOfGenres = () => {
        if (!listOfBooks) return;

        const listOrigin = listOfBooks;
        const newListSet = [...new Set(listOrigin.map(book => book.gender))]
        return newListSet;
    }

    if (!listOfBooks) return ("Obteniendo información de la base de datos...")

    return (
        <BooksContext.Provider value={{ listOfBooks, readingList, filter, setListOfBooks, storeABook, unstoreABook, getListOfGenres, setFilter, filterList }}>
            {children}
        </BooksContext.Provider>
    )
}