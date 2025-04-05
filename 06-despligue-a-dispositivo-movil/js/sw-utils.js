// Guardar en el cache dinamico
// Le pasamos el nombre del cache, la Request que es lo que nos estan pidiendo y la response obtenida
const actualizaCacheDinamico = ( dynamicCache, req, res ) => {
    // Si se hace la respuesta significa que tenemos datos y los almacenamos en el cache
    if( res.ok ){
        return caches.open( dynamicCache ).then( cache => {
            // Almacenamos en el cache la request
            cache.put( req, res.clone() );
            // Tenemos que regresar algo sino tendremos undefined
            return res.clone();
        });
    }else{
        // Si no viene nada, no hay mucho que podamos hacer, porque aqui ya fallo el cache y fallo la RED
        // Regresamos lo que sea que venga en la respuesta
        return res;
    }
    /*
        Despues de probar veremos que en el cache dinamico tenemos las fuentes, el fontAwesome u otras librerias
        no se cargaran hasta navegar a una pagina donde se esten utilizando
        El problema es que si esta el usuario en el celular y pierde la conexion estos iconos se pierden
        ocupamos cargar esto en la aplicacion
    */
}