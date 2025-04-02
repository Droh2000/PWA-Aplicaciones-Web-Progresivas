self.addEventListener('fetch', event => {
    
    // Manejar el error de un recurso que no fue encontrado
    event.respondWith(
        // Como este es un error del protocolo 400 no sera atrapado por el Catch
        fetch( event.request ) // Recibimos la respuesta que es donde esta el error
        .then( resp => {
            // Aqui obtenemos todas las respuestas y nos toca filtrar la que tiene el error
            // De aqui podemos sacar la propiedad del Ok=false y el status
            //      console.log(resp);

            if( resp.ok ) {
                // Estamos manejado aqui la respuesta de modo, la resolucion de esta promesa termina aqui
                // y el "event.respondWith" requiere un retorno que sea una respuesta o una promesa que regrese
                // un respond de un fetch
                return resp;
                // Si vemos que despues de este cambio la pagina se bloqueo y no responde tenemos que ir a la pestana de Application-> Clear Storage
                // y ahi limpiamos todo el cache y recargamos el navegador web
            } else {
                // Ahora tenemos que evaluar el tipo de archivo que dio el error, ya que si retornamos aqui directamente la imagen
                // en cualquier peticion que de error, le estaremos poniendo la imagen
                // retornamos esta imagen para el caso que falle
                return fetch('img/main.jpg');
            }
        })
    );
});

// Con cada cambio que hagamos en este archivo nos pedira en la pestana de Application que activemos el nuevo SW
// precionando en la opcion de "skipWaiting" y recargar el navegador