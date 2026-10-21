import { Routes, Route } from "react-router-dom";

import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";

import Inicio from "./paginas/Inicio";
import DetalleProducto from "./paginas/DetalleProducto";
import Catalogo from "./paginas/Catalogo";

import Login from "./paginas/Login";

import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Novedades from "./paginas/Novedades";
import NovedadDetalle from "./paginas/NovedadDetalle";
import PreguntasFrecuentes from "./paginas/PreguntasFrecuentes";

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

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/nosotros"
                    element={<Nosotros />}
                />

                <Route
                    path="/contacto"
                    element={<Contacto />}
                />

                <Route
                    path="/novedades"
                    element={<Novedades />}
                />

                <Route
                    path="/novedades/:slug"
                    element={<NovedadDetalle />}
                />
                
                <Route
                    path="/preguntas-frecuentes"
                    element={<PreguntasFrecuentes />}
                />


            </Routes>

            <Footer />

        </div>

    );

}

export default App;