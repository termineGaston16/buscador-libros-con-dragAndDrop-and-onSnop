import Filter from "./Filter";

export default function Header() {
    return (<>
        <header>
            <h1>Bibliotecla de Libros</h1>
            <h4>¡Disfruta de nuestro catalogo!</h4>
            <hr />
                <Filter />
            <hr />
        </header>
    </>)
}