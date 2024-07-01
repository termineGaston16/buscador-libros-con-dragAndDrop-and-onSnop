import { useContext, useId } from "react";
import { BooksContext } from "../../../context/books"

export default function Filter() {

    const { listOfBooks, getListOfGenres, filter, setFilter, filterList } = useContext(BooksContext)
    const idSelectGenre = useId();

    const handleChangeGenre = (event) => {
        setFilter(prevFilter => ({ ...prevFilter, genderDefault: event.target.value }))
    }

    const getAvailableBooks = () => {
        const availableBooks = listOfBooks.reduce((cant, book) => {
            return cant + (book.reading ? 0 : 1);
        }, 0)

        return availableBooks;
    }

    return (<>
        <section>

            <div>
                <label htmlFor={idSelectGenre}>Filtrar por Género</label>
                <select id={idSelectGenre} onChange={handleChangeGenre}>
                    <option value="all">Todo el Catálogo</option>
                    {getListOfGenres().map((genre, index) => (
                        <option key={index} value={genre}>{genre}</option>
                    ))}
                </select>
            </div>
            <div>
                Libros Disponibles: <span>{getAvailableBooks()}</span>
            </div>
            <div>
                {(filter.genderDefault !== "all") ?
                    <p>Libros Disponibles según Categoría: {filterList().length}</p> :
                    null}
            </div>

        </section>
    </>)
}