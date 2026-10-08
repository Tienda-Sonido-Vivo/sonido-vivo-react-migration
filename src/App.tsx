// src/App.tsx

import { Routes, Route } from "react-router-dom";

import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";

import Inicio from "./paginas/Inicio";
import DetalleProducto from "./paginas/DetalleProducto";
import Catalogo from "./paginas/Catalogo";

function App() {

    return (

        <div className="app">

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Inicio />}
                />

                <Route
                    path="/catalogo"
                    element={<Catalogo />}
                />

                <Route
                    path="/producto/:codigo"
                    element={<DetalleProducto />}
                />


            </Routes>

            <Footer />

        </div>

    );

}

export default App;