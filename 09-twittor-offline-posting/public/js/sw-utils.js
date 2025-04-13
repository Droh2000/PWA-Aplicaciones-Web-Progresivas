

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

