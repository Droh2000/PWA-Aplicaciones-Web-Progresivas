// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});





self.addEventListener( 'fetch', e => {
    // Vamos a cambiar la estrategia del cache para que sea Network With Cache Callback, es decir si no logra hacer el Fetch Primero
    // entonces va a traernos lo que se encuentre en el cache, pero esto solo lo queremos hacer cuando se ejecute una peticion a la API
    // La logica implementada aqui es: Se hace el Fetch no importa que peticion sea y todo entrea por aqui

    let respuesta;

    // Este proceso no se debe de ejecutar cuando se llama nuestra api
    // Ponemos "/api" y no la palabra "api" porque podria detectar los CDN que tambien incluyen esa palabra
    if( e.request.url.includes('/api') ){
        // La implementacion del Network With Cache Callback lo implementamos aqui
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );
    }else{
        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                // anteriormente teniamos esta linea comentada y nuestra estrategia era Cache With Network Callback
                // Es decir si no se encontraba en el cache se iba a la web, hacia el Fetch y lo grabab en el cache 
                // y despues solo tomaba los datos del cache 
                // Ahora con esta linea queremos implementar Cache With Network Update (Despues de que recibimos la informacion del Cache)
                // la respondemos y rapidamente tenemos la respuesta en el cliente pero a su vez vamos a lanzar una actualizacion del cache
                // Aqui mandamos el nombre del cache, el Request que nos estan socilicitando y mandamos todo el arreglo que esta en el Inmmutable
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
            } else {

                return fetch( e.request ).then( newRes => {

                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
                });
            }
        });
    }
    // Despues de esta implementacion al cambiar el arreglo de mensajes y recargar el navegador, debemos de ver lo luego los nuevo mensajes
    // Al perder la conexion debemos de seguir viendo el mensaje en e fronted porque lo esta tomando del cache
    e.respondWith( respuesta );
});


