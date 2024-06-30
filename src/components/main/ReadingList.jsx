import { useContext } from "react"
import { BooksContext } from "../../context/books"

export default function ReadingList() {

    const { readingList, storeABook, unstoreABook } = useContext(BooksContext)

    function handleDrop(event) {
        event.preventDefault();
        const book = JSON.parse(event.dataTransfer.getData("book"));
        storeABook(book);
    }

    return (<>
        <div onDrop={(event) => handleDrop(event)} onDragOver={(event) => event.preventDefault()} style={{ overflow: "auto", border: "1px solid yellow", position: "sticky", top: "2rem", height: "80vh", width: "30vw" }}>
            <ul style={{ listStyle: "none", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0", margin: "0" }}>
                {readingList.map((book, index) => (
                    <li key={index} style={{ border: "1px solid violet" }}>
                        <button onClick={()=> unstoreABook(book)}>X</button>
                        <img src={book.cover} alt={book.title} style={{ width: "30%" }} />
                        <h3>{book.title}</h3>
                    </li>
                ))}
            </ul>
        </div>
    </>)
}