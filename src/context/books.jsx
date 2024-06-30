import { createContext, useEffect, useState } from "react";
import { getBooksFromData } from "../firebase/firebase"

export const BooksContext = createContext();

export function BooksProvider({ children }) {
    const [listOfBooks, setListOfBooks] = useState(null)
    const [readingList, setReadingList] = useState([])

    useEffect(() => {

        //obtener los datos del firestore
        getBooksFromData()
            .then(data => {
                const listMapped = data.map(book => ({
                    id:book.id,
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
                    reading: false
                }))

                setListOfBooks(listMapped)
            })
            .catch(err => console.error(err))
    }, [])

    //Almacenar un libro en la lista de lectura
    const storeABook = (book) => {
        if (book.reading) return alert("Este libro ya está almacenado");

        setReadingList(prevList => [...prevList, { ...book, reading: true }])

        const listOrigin = listOfBooks;
        const indexOfBook = listOrigin.findIndex(bookIn => bookIn.id === book.id)

        const newList = structuredClone(listOrigin)
        newList[indexOfBook].reading = true;
        return setListOfBooks(newList)
    }

    //Desalmacenar un libro en la lista de lectura
    const unstoreABook = (book) => {
        const listbooks = listOfBooks;
        const listreading = readingList;

        const newListReading = listreading.filter(booksIn => booksIn.id !== book.id)
        setReadingList(newListReading)

        const indexOfBook = listbooks.findIndex(bookIn => bookIn.id === book.id)
        const newListOfBook= structuredClone(listbooks)
        newListOfBook[indexOfBook].reading = false;
        setListOfBooks(newListOfBook)
        return;
    }

    //Obtener una lista de los géneros
    const getListOfGenres =()=>{
        if(!listOfBooks) return;

        const listOrigin = listOfBooks;
        const newListSet=[...new Set(listOrigin.map(book => book.gender))]
        return newListSet;
    }

    if (!listOfBooks) return ("Obteniendo información de la base de datos...")

    return (
        <BooksContext.Provider value={{ listOfBooks, readingList, setListOfBooks, storeABook, unstoreABook, getListOfGenres }}>
            {children}
        </BooksContext.Provider>
    )
}