//asi llamo a espres a traves del require
const express = require('express');

//aqui tengo toda la libreria de express
const app = express();

//asi hago la carpeta accesible public
const path = require('path');

//invoco a listen con app defino el puerto que vamos a ver nnuestros cambios poner en google localhost:3000
app.listen(3000, () => {
    console.log("Servidor a la espera de peticiones")
});


//creo una constante y llamo al archivo donde se encuentran las rutas
const rutes = require('./routers/index.routes');

//llamar a app para que importe el json y haga uso de las rutas en el body
app.use(express.json());
app.use(rutes);

//aqiui le digo que haga uso de recursos estaticos
app.use(express.static(path.join(__dirname,'../public')))