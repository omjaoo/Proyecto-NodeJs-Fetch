const { request  } = require('express');

//creo la constante controler para manipular las rutas
const controler = {};

//llamo al path
const path = require('path');

//constante para guardar el json
const rutaJson = path.join(__dirname, '../casas.json');

//necesitare hacer peticiones asincronas asi que pedire los promises
const fs = require('fs/promises');

//creo una funcion llamada index para que me devuelva un index
controler.index = (req,res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"))
}

//funcion para agregue una casa 
controler.añadirInmueble = async (req,res) => {
    let casaNueva = req.body;
    //asi lo tomo desde el formulario ya que no se lo pasare por url
    const tipoInmueble = req.body.tipoInmueble;
    console.log(tipoInmueble)
    //esto me devuelve un objeto
    const casas = await fs.readFile(rutaJson);

    //parseo el archivo
    const casasJSON = JSON.parse(casas);

    //creo una constante para controlar los duplicados lo hare por el metodo
    //he decidido que para controlar los duplicados basicamente controlare el numero de la casa y la calle
    //ya que no podra haber una misma casa con el mismo numero en la misma calle de la misma ciudad. Asi que controlare tambien que la ciudad no sea la misma.

    const existeDuplicado = casasJSON[tipoInmueble].find(casa => (casa.ciudad == casaNueva.ciudad && casa.direccion == casaNueva.direccion && casa.numero == casaNueva.numero));

    console.log(existeDuplicado);

    if (existeDuplicado) {
        return res.status(400).json({ error: "Esta casa ya existe con los mismos valores." });
    }

    //ahora con objects comprobare

    //con req.body almaceno la casa nueva en formato json
    //me daba error porque lo estaba intentando meter en casa sy la calve no existia
    //tendria q haberlo metido en casasJSON
    casasJSON[tipoInmueble].push(casaNueva);

    //leemos el archivo
    fs.writeFile(rutaJson, JSON.stringify(casasJSON));

    res.send(casasJSON);
}

controler.casas = async (req,res) => {

    //esto me devuelve un object
    const misCasas = await fs.readFile(rutaJson);

    res.send(JSON.parse(misCasas));
}

//ruta de los pisos
controler.casasFloor = async (req,res) => {

    //esto me devulve el object que recorro
    const misCasas = await fs.readFile(rutaJson);

    const datos = JSON.parse(misCasas);

    const pisos = datos.floor;

    res.json(pisos)
}

//todos los errores del get y de la ruta es porque no tenia especificado la ruta aqui bien al principio

//ruta de los casas
controler.casasHome = async (req,res) => {

    //esto me devulve el object que recorro
    const misCasas = await fs.readFile(rutaJson);

    const datos = JSON.parse(misCasas);

    const casas = datos.home;

    res.json(casas)
}

controler.eliminar = async (req,res) => {
    const tipoInmueble = req.body.tipoInmueble;
    const id = req.body.id;
    console.log(tipoInmueble)

    const inmuebles = await fs.readFile(rutaJson);
    const inmueblesDatos = JSON.parse(inmuebles);
    let indice = -1;

    if(tipoInmueble == "floor"){
        //busco el indice del inmueble que se quiere eliminar
        indice = inmueblesDatos.floor.findIndex(inmueble => inmueble.id == id);
    }else if(tipoInmueble == "home"){
        //busco el indice del inmueble que se quiere eliminar
        indice = inmueblesDatos.home.findIndex(inmueble => inmueble.id == id);
    }

     // Verifica si el índice es -1, lo que significa que no se encontró el inmueble
     if (indice === -1) {
        return res.status(400).json({ error: "Este inmueble no se encuentra en la base de datos." });
    }

    // Elimina el inmueble
    if (tipoInmueble === "floor") {
        inmueblesDatos.floor.splice(indice, 1);
    } else if (tipoInmueble === "home") {
        inmueblesDatos.home.splice(indice, 1);
    }

    await fs.writeFile(rutaJson, JSON.stringify(inmueblesDatos));


    res.json(inmueblesDatos);

}

//controler que actualizara la propiedad
controler.actualizar = async (req, res) => {
    console.log('Datos recibidos:', req.body); // Verifica que los datos lleguen correctamente

    const tipoInmueble = req.body.tipoInmueble;
    const id = req.body.id;
    const nuevosDatos = req.body;

    console.log(tipoInmueble, id, nuevosDatos);

    // Leemos el archivo JSON con los inmuebles
    const inmuebles = await fs.readFile(rutaJson);
    const inmueblesDatos = JSON.parse(inmuebles);

    // Buscamos la propiedad a actualizar dependiendo del tipo de inmueble
    let propiedad = null;

    if (tipoInmueble === "home") {
        propiedad = inmueblesDatos.home.find(inmueble => inmueble.id === id);
    } else if (tipoInmueble === "floor") {
        propiedad = inmueblesDatos.floor.find(inmueble => inmueble.id === id);
    }

    // Verificamos si encontramos el inmueble
    if (!propiedad) {
        return res.status(404).json({ error: "Este inmueble no se encuentra en la base de datos." });
    }

    // Filtramos los datos que no queremos actualizar (id, tipoInmueble)
    const { id: idPropiedad, tipoInmueble: propertyType, ...datosAActualizar } = nuevosDatos;

    // Actualizamos la propiedad con los nuevos datos
    Object.assign(propiedad, datosAActualizar);

    // Escribimos los cambios en el archivo JSON
    await fs.writeFile(rutaJson, JSON.stringify(inmueblesDatos));

    res.json(inmueblesDatos)
};

controler.listar = async (req,res) => {

    // Leemos el archivo JSON con los inmuebles
    const inmuebles = await fs.readFile(rutaJson);
    const inmueblesDatos = JSON.parse(inmuebles);

    //voy aplanar el array
    const inmueblesPlano = Object.values(inmueblesDatos).flat();

    console.log(inmueblesPlano)
}



// Controlador para buscar por palabras clave
controler.buscador = async (req, res) => {
    const inmuebles = await fs.readFile(rutaJson);
    let inmueblesDatos = JSON.parse(inmuebles);
    const { query } = req; // Obtener parámetros de búsqueda
    //query tendra los parametros de busqueda que pueden ser mas de uno
    
    //aplano el array para poder hacer la busqueda mucho as facil
    let inmueblesDatos2 = [...inmueblesDatos.floor, ...inmueblesDatos.home];

    let resultados = inmueblesDatos2;

    //busco con el parametro reogido y conparamo con todos los atributos del objeto para devolver coincidencias
    //esta busqueda la he hecho insensible a mayusculas y minusculas
    if (query.query) {
        const search = query.query.toLowerCase();
        resultados = resultados.filter(inmueble =>
            String(inmueble.precio).includes(search) ||
            inmueble.ciudad.toLowerCase().includes(search) ||
            inmueble.direccion.toLowerCase().includes(search) ||
            String(inmueble.dormitorios).includes(search) ||
            String(inmueble.baños).includes(search)
        );
    }

    //devuelvo los resultados
    res.json(resultados);
};



//exporto controler para usarlo en el archivo de rutas
module.exports = controler;



