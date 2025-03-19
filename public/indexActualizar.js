
//selecciono el formulario
const formularioActualizar = document.querySelector("#formularioActualizar");

let rutaCasas = "";

//creo una funcion flecha a traves de una constante para recopilar los datos
const datosForm = () => {

    //asi obtengo los datos del formulario
    const datos = Object.fromEntries(new FormData(formularioActualizar));

    return datos;
}

//ahora hare una peticion fetch con los datos necesarios
const datosPost = async() => {

    const nuevaCasa = datosForm();
    const inmueble = document.querySelector('#tipoInmueble').value;
    console.log(inmueble)
    
    if(inmueble === "home"){
        rutaCasas = 'http://localhost:3000/api/casas/home';
    }else if(inmueble === "floor"){
        rutaCasas = 'http://localhost:3000/api/casas/floor';
    }
    


    //peticon fetch
    try{
        const response = await fetch(rutaCasas, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(nuevaCasa)
        });

        if(response.ok){
            const jsonResponse = await response.json();
            console.log("Casa eliminada correctamente", jsonResponse); // Verifica en consola
            mostrarDatos();
        }else{
            throw new Error(`Este inmueble ya existe.`);
        }

    }catch(err){
        console.log(err.message);

        //aqui mostrare el error a traves de la funcion que me voy a crear ahora
        mostrarError(err.message)
    }

}





const actualizar = async () => {
    const tipoInmueble = document.querySelector('#tipoInmueble').value;
    const id = document.querySelector('#id').value;
    const precio = document.querySelector('#price').value;
    const dormitorios = document.querySelector('#bedrooms').value;
    const baños = document.querySelector('#bathrooms').value;

    if (tipoInmueble === "home") {
        rutaCasas = 'http://localhost:3000/api/casas/home';
    } else if (tipoInmueble === "floor") {
        rutaCasas = 'http://localhost:3000/api/casas/floor';
    }

    try {
        const response = await fetch('/api/casas/actualizar', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                tipoInmueble,
                precio,
                dormitorios,
                baños
            })
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("Propiedad actualizada correctamente", jsonResponse);
            //con que le pase la ruta por parametro me lo coge
            mostrarDatos(rutaCasas); 
            location.reload();
        } else {
            throw new Error(`No se pudo actualizar la propiedad.`);
        }
    } catch (err) {
        console.log(err.message);
        mostrarError(err.message);
    }
}


// Función para obtener las calles y ciudades para un tipo de propiedad
const obtenerCalleYCiudad = async (tipoInmueble) => {
    // Aquí deberías buscar las casas o pisos disponibles, según el tipo de inmueble.
    let rutaCasas = '';
    if(tipoInmueble === 'home') {
        rutaCasas = 'http://localhost:3000/api/casas/home';
    } else if(tipoInmueble === 'floor') {
        rutaCasas = 'http://localhost:3000/api/casas/floor';
    }

    try {
        const response = await fetch(rutaCasas);
        const inmuebles = await response.json();

        // Extraemos las calles y ciudades de los inmuebles
        const calles = [...new Set(inmuebles.map(inmueble => inmueble.direccion))]; // Sin duplicados
        const ciudades = [...new Set(inmuebles.map(inmueble => inmueble.ciudad))]; // Sin duplicados

        // Llamamos a la función para llenar el select de calle y ciudad
        llenarSelect(calles, ciudades);
        

    } catch (error) {
        console.error("Error al obtener las propiedades:", error);
    }
}

// Función para llenar los selects de calle y ciudad
const llenarSelect = (calles, ciudades) => {
    const selectCalle = document.querySelector('#calle');
    const selectCiudad = document.querySelector('#ciudad');

    // Limpiamos las opciones anteriores
    selectCalle.innerHTML = '';
    selectCiudad.innerHTML = '';

    // Añadimos las nuevas opciones de calles
    calles.forEach(calle => {
        const option = document.createElement('option');
        option.value = calle;
        option.innerText = calle;
        selectCalle.appendChild(option);
    });

    // Añadimos las nuevas opciones de ciudades
    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad;
        option.innerText = ciudad;
        selectCiudad.appendChild(option);
    });
}

const tipoInmuebleSelect = document.querySelector('#tipoInmueble');

tipoInmuebleSelect.addEventListener('change', (e) => {
    const tipoInmueble = e.target.value; // "home" o "floor"
    obtenerCalleYCiudad(tipoInmueble); // llamo a la función para actualizar los selects   
});


//esta es la funcion que mostrara el alert en casa de intentar introducir una casa ya existe en el json
//basicamente pasa el mensaje por parametro reocjo el id del div que esta a none
//le quito display none con el class list y le añado contenido por la variable mensagge.
const mostrarError = async (menssage) => {
    console.log("esta entrando a la funcion para mostrar el error");
    const p = document.createElement('p');
    const divP = document.createElement('div');
    p.innerHTML = menssage;
    const divError = document.querySelector('#errorMessage');
    divError.innerHTML = "";
    divP.setAttribute("id","divP")
    p.setAttribute("id","pAlert");
    /* divP.appendChild(p);
    divError.appendChild(divP); */
    divError.innerHTML += menssage;
    divError.classList.remove("d-none"); 

    //eliminara el alert de bootstrap a traves de u  settimeout
    setTimeout(() => {
        divError.classList.add('d-none');
    }, 5000);
}

async function mostrarDatos(){
    console.log(rutaCasas)
    const response = await fetch(rutaCasas);
    const inmuebles = await response.json();

    //selecciono el div que va contener la lista
    const divLista = document.querySelector('#listaInmuebles');
    divLista.innerHTML = "<h1 class='ms-5 mt-3'>List of Properties</h1>";
    const tabla = document.createElement("table")
   
    tabla.innerHTML = `<thead>
                        <tr>
                            <td>ID</td>
                            <td>Email</td>
                            <td>Name</td>
                            <td>Number of House</td>
                            <td>address</td>
                            <td>Bedrooms</td>
                            <td>Bathrooms</td>
                            <td>Square meters</td>
                            <td>City</td>
                            <td>Price</td>
                        </tr>
                       </thead>
                       <tbody id="bodyTable"></tbody>`;
    
    //selecciono el tbody
    const tbody = tabla.querySelector('#bodyTable')

    //recorro todos los inmuebles y los ire poniendo en lista
    inmuebles.forEach(inmueble => {
        //creo el tr
        const tr = document.createElement('tr');
        tr.innerHTML += `
                                <td>${inmueble.id}</td>
                                <td>${inmueble.email}</td>
                                <td>${inmueble.nombre}</td>
                                <td>${inmueble.numero}</td>
                                <td>${inmueble.direccion}</td>
                                <td>${inmueble.dormitorios}</td>
                                <td>${inmueble.baños}</td>
                                <td>${inmueble.metrosCuadrados}</td>
                                <td>${inmueble.ciudad}</td>
                                <td>${inmueble.precio}</td>`;
        tbody.appendChild(tr);

    });
    
    divLista.appendChild(tabla);
}

// Modificar mostrarDatos para recibir un array de datos como parámetro
async function mostrarDatos2(inmuebles = []) {
    // Seleccionar el div que contiene la lista
    const divLista = document.querySelector('#listaInmuebles');
    divLista.innerHTML = "<h1 class='ms-5 mt-3'>List of Properties</h1>";

    const tabla = document.createElement("table");

    tabla.innerHTML = `
        <thead>
            <tr>
                <td>Type</td>
                <td>ID</td>
                <td>Email</td>
                <td>Name</td>
                <td>Number of House</td>
                <td>Address</td>
                <td>Bedrooms</td>
                <td>Bathrooms</td>
                <td>Square meters</td>
                <td>City</td>
                <td>Price</td>
            </tr>
        </thead>
        <tbody id="bodyTable"></tbody>
    `;

    const tbody = tabla.querySelector('#bodyTable');

    // Recorrer todos los inmuebles y agregarlos a la tabla
    inmuebles.forEach(inmueble => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${inmueble.tipoInmueble}</td>
            <td>${inmueble.id}</td>
            <td>${inmueble.email}</td>
            <td>${inmueble.nombre}</td>
            <td>${inmueble.numero}</td>
            <td>${inmueble.direccion}</td>
            <td>${inmueble.dormitorios}</td>
            <td>${inmueble.baños}</td>
            <td>${inmueble.metrosCuadrados}</td>
            <td>${inmueble.ciudad}</td>
            <td>${inmueble.precio}</td>
        `;
        tbody.appendChild(tr);
    });

    divLista.appendChild(tabla);
}

document.addEventListener("DOMContentLoaded", async () => {
    const rutaHome = 'http://localhost:3000/api/casas/home';
    const rutaFloor = 'http://localhost:3000/api/casas/floor';

    try {
        // Hacer las dos peticiones en paralelo
        const [responseHome, responseFloor] = await Promise.all([
            fetch(rutaHome),
            fetch(rutaFloor)
        ]);

        // Convertir ambas respuestas a JSON
        const [inmueblesHome, inmueblesFloor] = await Promise.all([
            responseHome.json(),
            responseFloor.json()
        ]);

        // Combinar los datos de home y floor
        const inmuebles = [...inmueblesHome, ...inmueblesFloor];

        console.log("Datos combinados:", inmuebles); // Verifica los datos en la consola

        // Mostrar la tabla con todos los datos combinados
        mostrarDatos2(inmuebles);

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});


if(formularioActualizar){
    formularioActualizar.addEventListener("submit", async(e) => {
        e.preventDefault();
        await actualizar();
    });

}