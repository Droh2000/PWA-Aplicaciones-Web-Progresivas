
/*
    APP SHELL
        Es todo lo que nuestra aplicacion nesecita a fuerzas para que funcione, en este caso podria ser toda la parte de los
        estilos, librerias externas, imegenes, JS
        Otros archivos que no estemos usando no serian parte del App Shell, otra cosa que no seria parte podria ser una peticion Ajax
        hacia un lugar que nos trae informacion

    Queremos guardar los cosas del App Shell en el cache, esto se hace cuando se instala el SW
*/
// const CACHE_NAME = 'cache-1';

// Con la estrategia de Cache with network fallback pasa un problema
// Si nos vamos al cache veremos que se nos mezclan cosas importantes del App Shell con recursos dinamicos (Informacion que puede ser obsoleta)
// Podemos tener diferentes caches para manejarlo mejor (La idea es que tengamos diferentes contenidos)
// ademas le especificamos versiones porque puede que hagamos un gran cambio que para mantener los otros archivos creamos otro archivo
const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
// Podemos considerar el cache inmutable (En este se meteria por ejemplo los del boostrap, ya que como estos archivo no van a cambiar nunca)
const CACHE_INMUTABLE_NAME = 'imutable-v1';

self.addEventListener('install', event => {
    // Abrimos el cache para almacenar (Aqui guradamos todos los archivos del App Shell para que funcione la app)
    const cacheProm = caches.open(CACHE_STATIC_NAME)
    .then( cache => {
        // Aqui agregamos todo lo del App shell al Cache
        // retornamos para que se almacene la promesa en la constante
        return cache.addAll([
            // Si no especificamos el Slash que va despues del dominio porque si no al implementar el cache nos dara error
            // ya que los usuario pueden entrar por el Slash o Index 
            './',
            './index.html',
            './css/style.css',
            './img/main.jpg',
            './js/app.js'
        ]);
        // Si uno de los archivos no los encuentra nos dara error
    });

    // Implementacion del cache unmutable
    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
    .then( cache => {
        return cache.addAll([
            // Esto es el CDN del Bootstran
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
        ]);
    });

    // Si podemos leer todo del cache entonces no requerimos llegar a la Web para mostrar la informacion
    // Ademas tenemos que esperar a que toda la promesa de arriba termine para poder continuar con el siguiente paso
    event.waitUntil( 
        Promise.all([cacheProm, cacheInmutable])
    );
});

/*
    Estrategias del Cache
        Esta es que una vez que se realiza la instalacion y creamos cada uno de ls recursos que nuestra pagina web requiere
        entonces nuestra applicacion jamas regresa a la web por los archivos
    
    Las estrategias del cache se hacen en el evento Fetch
*/
self.addEventListener('fetch', event => {

    // Cache Only
    // Esta es usada cuando queremos que toda la aplicacion sea utilizada desde el Cache, es decir no hara peticiones a la web
    // Aqui transformamos el recurso que sea que este pidiendo lo leeremos del cache storage
    // que aunque puede que tengamos muchos caches nos interesa que regrese en la respuesta el archivo del cache
    // con el .match se va a todos los caches (Los caches solo se pueden leer desde el mismo domino no desde paginas web diferentes)
    // y este metodo nos retorna el que concidia con la peticion
    //      event.respondWith( caches.match( event.request ) ); // Con esto si activamos el Offline la pagina seguira funcionando

    // La desventaja de esta estrategia es que se tiene que actualizar el SW para actualizar los archivos almacenados en el cache 3
    // pudiendo hacer que si el usuario accede a recursos que no estan en el cache, le dara error en toda la aplicacion

    // Cache With Network Fallback
    // Aqui intenta primero el cache y despues si no encuentra el archivo en el cache va a ir a la Web
    // Primero tenemos que verificar si el archivo o el request existe en el cache
    const respCache = caches.match( event.request )
        .then( res => {
            // Evaluar si existe el archivo (400 no los atrapa el Catch)
            if( res ) return res;// Si existe la respuesta esa es la enviamos

            // En este punto no existe el archivo que nos esta pidiendo entonces tenemos que ir a la web
            return fetch( event.request )
                .then( newResp => {
                    // Aqui quiere decir que encontro el archivo
                    // Debemos de hacer que si el cache no encuentra en el cache el archivo vaya siempre a la Red, el chiste es
                    // que depues de obtenerlo de la red lo guarde en el cache para no volver a hacer la peticion
                    // Aqui almacenaremos contenido dinamico porque este puede crecer un monton ya que cualquier peticion que no este
                    // en el cache va a pasar por aqui (Tenemos que implementar una estrategia para limpiar constantemente este cache, cosa
                    // que no hariamos con el statico ni el dinamico), este cache solo se crea cuando se pide un recurse que no existe en el cache
                    caches.open( CACHE_DYNAMIC_NAME )
                        .then( cache => {
                            // Guardamos en el cache
                            // Le pasamos la reqeuest (Si alguein solocita esto, este nombre es el que tiene que usar) y lo otro es lo que contiene la respuesta
                            cache.put( event.request, newResp );
                        });

                    // Si no la clonamos nos dara error porque la respuesta la estamos usando dos veses que es arriba y aqui abajo 
                    return newResp.clone();
                })
        });
        // Cuando probamos, recordemos que en la primera recarga de la pagina se instala el SW con todo los elementos del cache. tenemos que borrar los archivos del cache
        // y volver a recargar la pagina para verificar si esta funcionando la implementacion
        // Despues de la aplicacion de los otros cache, para probar este cache solo hay que eiminar elementos de los otros caches y cuando se recarge el navegador se creara este cache dinamico

    event.respondWith(respCache);
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
