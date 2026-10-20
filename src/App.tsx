// src/App.tsx

import {Routes,Route} from "react-router-dom";

import Navbar from "./componentes/organismos/Navbar";

import Footer from "./componentes/organismos/Footer";

import Inicio from "./paginas/Inicio";

import Catalogo from "./paginas/Catalogo";

import DetalleProducto from "./paginas/DetalleProducto";

import Login from "./paginas/Login";

import Registro from "./paginas/Registro";

import Carrito from "./paginas/Carrito";

import Checkout from "./paginas/Checkout";

import ConfirmacionPedido from "./paginas/ConfirmacionPedido";

import MisPedidos from "./paginas/MisPedidos";

import DetallePedido from "./paginas/DetallePedido";

import { useAppData } from "./hooks/useAppData";


function App() {

    /*
     * Toda la lógica de datos y estado
     * se encuentra separada en el hook.
     *
     * App solamente utiliza los datos
     * y funciones que necesita para
     * conectar las páginas mediante props.
     */
    const {

        usuarios,

        carrito,

        pedidos,

        productosDisponibles,

        correoUsuario,

        iniciarSesion,

        registrarUsuario,

        agregarAlCarrito,

        cambiarCantidad,

        eliminarDelCarrito,

        confirmarPedido

    } = useAppData();


    return (

        <div className="app">

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={
                        <Inicio />
                    }
                />


                <Route
                    path="/catalogo"
                    element={
                        <Catalogo />
                    }
                />


                <Route
                    path="/producto/:codigo"
                    element={
                        <DetalleProducto
                            productos={
                                productosDisponibles
                            }
                            onAgregarCarrito={
                                agregarAlCarrito
                            }
                        />
                    }
                />


                <Route
                    path="/login"
                    element={
                        <Login
                            usuarios={
                                usuarios
                            }
                            onIniciarSesion={
                                iniciarSesion
                            }
                        />
                    }
                />


                <Route
                    path="/registro"
                    element={
                        <Registro
                            usuarios={
                                usuarios
                            }
                            onRegistrarUsuario={
                                registrarUsuario
                            }
                        />
                    }
                />


                <Route
                    path="/carrito"
                    element={
                        <Carrito
                            carrito={
                                carrito
                            }
                            productos={
                                productosDisponibles
                            }
                            onCambiarCantidad={
                                cambiarCantidad
                            }
                            onEliminar={
                                eliminarDelCarrito
                            }
                        />
                    }
                />


                <Route
                    path="/checkout"
                    element={
                        <Checkout
                            carrito={
                                carrito
                            }
                            productos={
                                productosDisponibles
                            }
                            correoUsuario={
                                correoUsuario
                            }
                            onConfirmarPedido={
                                confirmarPedido
                            }
                        />
                    }
                />


                <Route
                    path="/confirmacion-pedido/:codigo"
                    element={
                        <ConfirmacionPedido
                            pedidos={
                                pedidos
                            }
                        />
                    }
                />


                <Route
                    path="/mis-pedidos"
                    element={
                        <MisPedidos
                            pedidos={
                                pedidos
                            }
                            correoUsuario={
                                correoUsuario
                            }
                        />
                    }
                />


                <Route
                    path="/mis-pedidos/:codigo"
                    element={
                        <DetallePedido
                            pedidos={
                                pedidos
                            }
                            correoUsuario={
                                correoUsuario
                            }
                        />
                    }
                />

            </Routes>

            <Footer />

        </div>

    );

}


export default App;