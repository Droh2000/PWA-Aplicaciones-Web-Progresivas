// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v2';
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
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js'
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

    let respuesta;

    // Recordemos que todas las peticiones que se hagan al Fetch que incluyen la palabra '/api' con procesadas por esta funcion "manejoApiMensajes"
    if ( e.request.url.includes('/api') ) {

        // return respuesta????
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

    } else {

        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
                
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
                });
    
            }
    
        });

    }

    e.respondWith( respuesta );

});


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if ( e.tag === 'nuevo-post' ) {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();
        
        e.waitUntil( respuesta );
    }



});

// Escuchar las notificaciones que mandamos (Debemos de recibir la notificacion sin tener el navegador abierto)
self.addEventListener('push', e => {
    // Con esto al especificar las propiedades en el Postman y enviar la Request, obtendremos en la consola del navegador estos datos
    // Lo que nos interesa es lo que esta en el campo "data" pero viene como un PushMessageData, pero podemos mandar un objeto serializado como un Hola mundo
    // la notificacion cae y es manejada del lado del Service worker
    //console.log(e);
    //console.log(e.data.text());

    // Toda la informacion que viene de la notificacion Push es recivida como JSON por eso usamos este metodo para convertirla
    const data = JSON.parse( e.data.text() );

    // Ahora en el SW vamos a mostrar la notificacion
    const title = data.titulo;
    // Tenemos varias opciones para las notificaciones
    const option = {
        body: data.cuerpo,
        icon: `img/avatars/${ data.usuario }.jpg`,
        // Este es el icono que le vamos a poner para cuando salga la notificacion en los dispositivos de Android
        badge: 'img/favicon.ico',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDnp6zj6aLBUll2xguxn0qMv52Uvn-R3X40A&s', // Imagen como Baner principal
        // Patron de vibracion podemos mandarle estos datos sacado de paginas para darle un sonido
        vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
        // Esta es la direccion que queremos abrir cuando se haga click
        openUrl: '/',
        // Estos datos van a estar contenidos en la notificacion
        data: {
            // Aqui podemos poner lo que queramos
            url: 'https://google.com',
            id: data.usuario
        },
        // Estas son las acciones que no son tan usadas porque normalmente solo las tocamos y que se desencadene las acciones por defecto
        // asi que estas son acciones personalizadas (Aqui podriamos indicar un CRUD)
        actions: [
            {
                action: 'thor-action',
                title: 'Thor',
                icon: 'img/avatar/thor.jpg'
            },
            {
                action: 'ironman-action',
                title: 'Ironman',
                icon: 'img/avatar/ironman.jpg'
            }
            // Estas acciones las vemos al recibir la notificacion en los tres puntos al hacer click tenemos mas acciones
        ]
    };
    // Muchas de estas opciones las tenemos que probar en el dispositivo movil

    // Para mandar la notificacion, pero como toda accion en el SW tenemos que esperar a que termine, asi que nos interesa a que la notificacion
    // haga todo lo que tenga que hacer
    e.waitUntil( self.registration.showNotification(title, option) );

});

// Ahora tenemos definidas acciones para las notificacion pero si hacemo click en ellas no pasa nada, vamos a ver que tenemos dos eventos
// relacionados, esta es cuando se cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificacion Cerrada', e);
});

// Este es cuando se hace click en la notificacion (Esta se ejecuta cuando el usuario toca la notificacion o toca alguna de las acciones)
self.addEventListener('notificationclick', e => {
    // Obtenemos referencia a todas las opciones que definimos 
    const notificacion = e.notification;
    // Esto es la accion que la persona toco
    const accion = e.action;
    // Si vemos en consola veremos que al tocar en el cuerpo de la notificacion no recibimos ninguna accion, esto es solo cuando tocamos en alguna de las acciones

    // En el momento que se llame esto, se cierra la notificacion
    notificacion.close();
});
