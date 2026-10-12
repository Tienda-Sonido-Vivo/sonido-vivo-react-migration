// src/layouts/LayoutPublico.tsx

import { Outlet } from "react-router-dom";

import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";


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
