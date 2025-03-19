const formularioBuscar = document.querySelector("#formularioBuscar");

formularioBuscar.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const query = document.querySelector("#searchInput").value.trim(); // el valor del input
    if (!query) return; // no hacer nada si el campo está vacío

    // llamo a la función con la búsqueda
    buscarInmuebles(query);
});

const buscarInmuebles = async (query) => {
    try {
        const response = await fetch(`http://localhost:3000/api/casas/buscar?query=${query}`);
        const inmuebles = await response.json();
        mostrarResultados(inmuebles);
    } catch (error) {
        console.error("Error al buscar:", error);
        mostrarError("No se encontraron resultados.");
    }
};

const mostrarResultados = (inmuebles) => {
    const inputBusqueda = document.querySelector('#searchInput').value;
    const divLista = document.querySelector("#listaInmuebles");
    const pInfo = document.createElement('p');
    pInfo.innerHTML += `Los resultados de tu busqueda, ${inputBusqueda}`;
    pInfo.setAttribute("class", "ms-5 me-5")
    
    if (inmuebles.length === 0) {
        
        let x = "No se encontraron inmuebles con tu filtro de busqueda";
        mostrarError(x) 
        return;
    }
    divLista.innerHTML = "<h1 class='ms-5 mt-3'>Resultados de la búsqueda</h1>";
    divLista.appendChild(pInfo);
    const tabla = document.createElement("table");
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Número</th>
                <th>Dirección</th>
                <th>Dormitorios</th>
                <th>Baños</th>
                <th>M²</th>
                <th>Ciudad</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody id="bodyTable"></tbody>`;

    const tbody = tabla.querySelector("#bodyTable");

    inmuebles.forEach((inmueble) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
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
};

const mostrarError = (mensaje) => {
    const divError = document.querySelector("#errorMessage");
    divError.innerHTML = mensaje;
    divError.classList.remove("d-none");

    setTimeout(() => {
        divError.classList.add("d-none");
    }, 5000);
};
