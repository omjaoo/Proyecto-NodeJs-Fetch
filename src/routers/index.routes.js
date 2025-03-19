//necesito express asi que creo una coonstante llamando a la libreria
const express = require('express');

//creo una constante que se llame router para crear las rutas
const router = express.Router();

//creo la ruta para añadir una casa a traves de post
router.use(express.json());

//creo la constante controler y hago el require para que pueda ser usada
const controler = require("../controllers/indexController");


//creo una ruta para apadir pisos o casas al json
router.post('/api/casas/:inmueble', controler.añadirInmueble);


//creo una ruta para ver el json
router.get('/api/casas', controler.casas);

//creo rutas tanto de floor como de home para poder usarlas en el index js
router.get('/api/casas/floor', controler.casasFloor);
router.get('/api/casas/home', controler.casasHome);
router.get('/api/casas/listar', controler.listar);

//creo una ruta para eliminar un inmueble por delete
router.delete('/api/casas/eliminar', controler.eliminar);

//creo una ruta para actualizar una vivienda
router.put('/api/casas/actualizar', controler.actualizar);


//creo una ruta para buscar
router.get('/api/casas/buscar', controler.buscador);

//exporto la variable
module.exports = router;