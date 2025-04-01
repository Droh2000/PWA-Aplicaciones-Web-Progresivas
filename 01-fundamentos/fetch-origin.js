// Asi se hacia antes de la llega del Fecth API
// Para que este codigo funcione lo tenemos que meter dentro del HTML
// Despues de eso ejecutamos el servidor normalmente

// Declaramos la peticion
const request = new XMLHttpRequest();

// Le pasamos el tipo de peticion
// Endpoint (En este caso usamos una pagina de prueba que nos genera datos)
// Le ponemos True porque queremos que sea una peticion asyncrona
request.open('GET', 'https://reqres.in/api/users', true);
// Esto es por si requeremos mandar algun argumento
request.send(null);

// Requerimos estar al pendiente de los cambios de estado de ese request
request.onreadystatechange = ( state ) => {
    // Si miramos la respuesta veremos que hay tres peticiones, la que nos interesa es la ultima porque es cuando la operacion termino
    // la primera es que los headers fueron recibidos, y la otra es porque un loading
    //  console.log(request)

    // Si es igual a la ultima (que en este caso tiene ese valor) significa que ya temrino y tenemos los datos
    if( request.readyState === 4 ){
        // Extraemos los datos
        const resp = request.response;
        // Esto nos da un String, no es el objeto que requerimos, asi que tenemos que transformar esa respuesta
        const respObj = JSON.parse( resp );

        // Ahora si podemos las partes de los datos que nos interesa
        console.log(respObj.page);
    }
}
// Tenemos demaciada logica para una simple peticion HTTP