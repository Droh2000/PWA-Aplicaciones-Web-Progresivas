// Creamos el nombre y los tipos de caches que queremos usar
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// Definimos los archivos importantes para que la aplicacion funcione
// Algunas cosas quesan a consideracion nuestra pero si todo lo es librerias de terceros tenemos el cache inmutable
// Este es el corazon de la aplicacion
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
    'js/app.js'
]

// Estos son los recursos que no se van a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
]

// Parte de la instalacion del SW
self.addEventListener('install', event => {
    // De las constantes que creamos debemos de almacenarlas en sus respectivos caches
    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => cache.addAll( APP_SHELL ));
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => cache.addAll( APP_SHELL_INMUTABLE ));

    event.waitUntil(Promise.all([ cacheStatic, cacheInmutable ]));
});

// Aqui vamos a hacer que cada vez que cambiemos el SW, nos borre los caches anteriores que ya no sirven
self.addEventListener('activate', event => {
    // Verificamos si la version del cache actual que se encuentra en el SW es la misma que el cache activo
    // entonces no hacemos nada, pero si hay una diferencia borramos el cache estatico
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });
    event.waitUntil( respuesta );
});