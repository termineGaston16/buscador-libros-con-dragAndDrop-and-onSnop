import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const BookPanel = lazy(() => import("./components/main/BookPanel"))
const Header = lazy(()=> import("./components/main/header/Header"))

const BooksProvider = lazy(() => import("./context/books").then(module => ({ default: module.BooksProvider })));



export default function App() {


    return (<>
        <BrowserRouter>
            <Suspense fallback="Cargando App...">
                <BooksProvider>
                    <Header />

                    <Routes>
                        <Route exact path="/" element={<BookPanel />} />
                    </Routes>
                </BooksProvider>
            </Suspense>
        </BrowserRouter>
    </>)
}