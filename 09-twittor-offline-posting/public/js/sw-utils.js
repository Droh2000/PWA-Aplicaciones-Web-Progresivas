

// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) {

        return caches.open( dynamicCache ).then( cache => {

            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {

    // Si se encuentra en el arreglo que contiene los datos, no hacemos nada porque esto solo cambiara cada vez que cambiemos de version
    // el cache
    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch( req )
                .then( res => { // Traemos el Request si lo encuentra
                    // Reutilizamos la funcion de actualizacion
                    // Esto es para que nuestro cache aunque este una version atras siempre lo vamos a estar actualizando
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }
}

// Network With Cache Callback
// Requerimos que nos manden el cache que queremso gaurdar y la Request (Lo que nos estan solicitando que hagamos)
function manejoApiMensajes( cacheName, req ) {
    // Sabemos que cualquier peticion que venga de la APi sera capturada aqui, pero como el Cache no maneja el POST tenemos que hacer un tipo de estrategia
    // especial, entonces verifiquemos si es un posteo lo que nos estan socilitando (La clonamos para poder leerla porque habeses se hacen no a su correspondiente tiempo )
    if( req.clone().method === 'POST' ){
        // POSTEO de un nuevo mensaje no podemos retornar directamente con un Fetch porque lo estamos dejando pasar directamente es como si no hicieramos nada
        // esto seria igual a la estrategia de solamente Network porque las peticiones pasarian normal 

        // Si revisamos en el Cache Storage -> en el Static y en el archivo de sw-utils veremos que no tenemos esta parte de codigo que escribimos
        // Como este no es el archivo del SW, el navegador no reinstala los cambios, una solucion es subir de version el cache Static en el SW       

        // Tenemos que guardar en el IndexDB
        return fetch( req );
    } else {
        // Primero debemos de intentar traer los datos mas actualizados
        // le ponemos el Return para que nos regrese el fetch (La promesa) y esta es la respuesta que espera por la implementacion en el SW.js
        return fetch( req ).then( res => {
            // Si se hace correctamente nos interesa actualizar el Cache dinamico para almacenarlo ahi
            if( res.ok ){
                // La resp la clonamos porque puede que la sigamos usando
                actualizaCacheDinamico( cacheName, req, res.clone() );
                // Tambien usamos el clone para asegurarnos que el res de arriba no se use primero
                return res.clone();
            }else{
                // Si la respuesta no es exitosa
                // Vamos a retornar los mensajes anteriores que tengamos almacenados en el Cache 
                return caches.match( req );
            }
        })
        // Esto es por si no tenemos conexion a internet
        .catch(err => {
            // Si ya aqui no hay nada nos dara error que no encontro nada 
            return caches.match(req);
        });
    }
}

