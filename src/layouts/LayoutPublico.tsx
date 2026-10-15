// src/layouts/LayoutPublico.tsx

import { Outlet } from "react-router-dom";

import Navbar from "../componentes/organismos/Navbar";
import Footer from "../componentes/organismos/Footer";


function LayoutPublico() {

    return (

        <div className="app">

            <Navbar />

            <Outlet />

            <Footer />

        </div>

    );

}


export default LayoutPublico;
