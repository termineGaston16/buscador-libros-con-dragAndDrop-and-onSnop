import { Suspense, lazy, useContext } from "react"
import { BooksContext } from "../../context/books"
const ReadingList = lazy(() => import("./ReadingList"))

export default function BookPanel() {

    const { listOfBooks, readingList, storeABook } = useContext(BooksContext)

    const handleDragStart =(event, book)=>{
        event.dataTransfer.setData("book", JSON.stringify(book))
    }

    return (<>
        <main>
            <div style={{ display: "flex", justifyContent: "space-between", width: "90vw", maxWidth: "1200px", gap: "1rem" }}>
                <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gridAutoRows: "300px", gap: "1rem", listStyle: "none", padding: "0px", margin: "0px" }}>
                    {listOfBooks.map((book, index) => (
                        <li draggable onDragStart={(event) => handleDragStart(event, book)} onClick={() => { storeABook(book) }} key={index} style={{ border: "1px solid red", cursor: "pointer", opacity: book.reading ? 0.5 : 1 }}>
                            <img src={book.cover} alt={book.title} style={{ width: "40%" }} />
                            <h6>{book.title}</h6>
                        </li>
                    ))}
                </ul>
                <Suspense fallback="cargando lista de lectura...">
                    {readingList.length !== 0 && <ReadingList />}
                </Suspense>
            </div>
        </main>
    </>)
}