//import { actualizaCacheDinamico } from "./js/sw-utils";
importScripts("js/sw-utils.js"); // Solo funciono con esta importacion

// Creamos el nombre y los tipos de caches que queremos usar
const STATIC_CACHE = 'static-v1'; // Si estamos haciendo pruebas con celulares, subimos de version el cache para que haga la nueva instalacion y tome los nuevos archivos
const DYNAMIC_CACHE = 'dynamic-v1'; // Igual este se sube de version para que tome los cambios
const INMUTABLE_CACHE = 'inmutable-v1';

// Definimos los archivos importantes para que la aplicacion funcione
// Algunas cosas quesan a consideracion nuestra pero si todo lo es librerias de terceros tenemos el cache inmutable
// Este es el corazon de la aplicacion
const APP_SHELL = [
    // '/', // Esta linea se comenta en produccion
    // Para que funcione en Github nada debe de empezar con el slash
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    // El archivo es importante para que funcione correctamente la app
    'js/sw-utils.js',
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
            // Para que cuando se hace la instalacion, tambien actualize el cache dinamico
            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });
    event.waitUntil( respuesta );
});

// Implementar la estrategia del cache
self.addEventListener('fetch', event => {

    //1.- Cache Only
    // Tenemos que verificar en el cache si existe el elemento que vieja en la request
    const respCache = caches.match( event.request ).then( res => {
        // Si existe la respuesta, regresa la respuesta
        if( res ){
            return res;
        }else{
            // Si no existe la respuesta
            // Si la respuesta no se encuentra, esto nos regresa undefined y nos dara error
            //      console.log(event.request.url)
            // Si nos da error es porque de las CDN hace una peticion a otra pagina que les brinda el recurso, como el de las fuentes
            // Internamente hace una solicitud a otra direccion diferente que la que especificamos, por eso no encuentra ningnu match
            // Esta peticion la tenemos que guardar en el cache dinamico
            return fetch( event.request ).then( newRes => {
                // Para que el codigo no cresca mucho separamos la logica en modulos
                return actualizaCacheDinamico( DYNAMIC_CACHE, event.request, newRes );
            });
        }
    });

    event.respondWith( respCache );
});