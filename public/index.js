//selecciono el formulario
const formulario = document.querySelector("#formulario");

let rutaCasas = "";

//creo una funcion flecha a traves de una constante para recopilar los datos
const datosForm = () => {

    //asi obtengo los datos del formulario
    const datos = Object.fromEntries(new FormData(formulario));

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




if(formulario){

    formulario.addEventListener("submit", async(e) => {
        e.preventDefault();
        await datosPost();
    });

}