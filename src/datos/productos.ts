// src/datos/productos.ts

import type { Producto } from "../interfaces/Producto";

export const productos: Producto[] = [

    {
        codigo: "BA001",
        nombre: "Bajo Eléctrico 4 Cuerdas",
        categoria: "Bajos Eléctricos",
        marca: "Squier",
        modelo: "Affinity PJ",
        precio: 299990,
        stock: 5,
        imagen: "/img/tarjetas/Bajo Eléctrico 4 Cuerdas squier Affinity PJ.webp",
        descripcion: "Pickup PJ, cuerpo álamo, mástil arce."
    },

    {
        codigo: "BA002",
        nombre: "Bajo Eléctrico Jazz Bass",
        categoria: "Bajos Eléctricos",
        marca: "Fender",
        modelo: "Player Jazz",
        precio: 699990,
        stock: 2,
        imagen: "/img/tarjetas/Bajo Fender Player Jazz.jpg",
        descripcion: "Alder body, 2 Alnico V Jazz single-coil."
    },

    {
        codigo: "BA003",
        nombre: "Bajo Acústico 4 Cuerdas",
        categoria: "Bajos Eléctricos",
        marca: "Yamaha",
        modelo: "APX700II",
        precio: 429990,
        stock: 2,
        imagen: "/img/tarjetas/Bajo Acústico 4 Cuerdas Yamaha APX700II.jpg",
        descripcion: "Electroacústico, afinador incorporado."
    },

    {
        codigo: "GA001",
        nombre: "Guitarra Acústica Folk",
        categoria: "Guitarras Acústicas",
        marca: "Yamaha",
        modelo: "F310",
        precio: 129990,
        stock: 8,
        imagen: "/img/tarjetas/Guitarra Acustica Yamaha F310.webp",
        descripcion: "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes."
    },

    {
        codigo: "GA002",
        nombre: "Guitarra Acústica Dreadnought",
        categoria: "Guitarras Acústicas",
        marca: "Fender",
        modelo: "CD-60S",
        precio: 189990,
        stock: 5,
        imagen: "/img/tarjetas/Guitarra Acústica Dreadnought Fender CD-60S.jpg",
        descripcion: "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado."
    },

    {
        codigo: "GA003",
        nombre: "Guitarra Acústica Clásica 4/4",
        categoria: "Guitarras Acústicas",
        marca: "Yamaha",
        modelo: "C40",
        precio: 89990,
        stock: 10,
        imagen: "/img/tarjetas/Guitarra Acústica Clásica Yamaha C40.webp",
        descripcion: "Nailon, tapa de abeto. Ideal para estudio y flamenco."
    },

    {
        codigo: "BT001",
        nombre: "Batería Acústica 5 piezas",
        categoria: "Baterías",
        marca: "Pearl",
        modelo: "Roadshow",
        precio: 599990,
        stock: 2,
        imagen: "/img/tarjetas/Bateria Pearl Roadshow.jpeg",
        descripcion: "Incluye stands, platillos y pedal de bombo."
    },

    {
        codigo: "BT002",
        nombre: "Batería Electrónica 8 pads",
        categoria: "Baterías",
        marca: "Roland",
        modelo: "TD-02KV",
        precio: 799990,
        stock: 2,
        imagen: "/img/tarjetas/Bateria Roland TD-02KV.webp",
        descripcion: "Módulo TD-02, 8 pads de goma, pedal hi-hat."
    },

    {
        codigo: "BT003",
        nombre: 'Caja Snare 14"',
        categoria: "Baterías",
        marca: "Pearl",
        modelo: "STE1450",
        precio: 89990,
        stock: 4,
        imagen: "/img/tarjetas/Caja Snare 14 Pearl STE1450.jpeg",
        descripcion: 'Acero, 14x5", 10 tensores.'
    }

];