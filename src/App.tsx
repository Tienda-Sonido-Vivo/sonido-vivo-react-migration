import { Routes, Route } from "react-router-dom";

import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";

import Inicio from "./paginas/Inicio";

function App() {

    return (

        <div className="app">

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Inicio />}
                />


            </Routes>

            <Footer />

        </div>

    );

}

export default App;