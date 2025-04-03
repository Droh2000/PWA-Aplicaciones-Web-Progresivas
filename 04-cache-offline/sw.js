
/*
    APP SHELL
        Es todo lo que nuestra aplicacion nesecita a fuerzas para que funcione, en este caso podria ser toda la parte de los
        estilos, librerias externas, imegenes, JS
        Otros archivos que no estemos usando no serian parte del App Shell, otra cosa que no seria parte podria ser una peticion Ajax
        hacia un lugar que nos trae informacion

    Queremos guardar los cosas del App Shell en el cache, esto se hace cuando se instala el SW
*/
self.addEventListener('install', event => {
    // Abrimos el cache para almacenar
    const cacheProm = caches.open('cache-1')
    .then( cache => {
        // Aqui agregamos todo lo del App shell al Cache
        // retornamos para que se almacene la promesa en la constante
        return cache.addAll([
            './index.html',
            './css/style.css',
            './img/main.jpg',
            // Esto es el CDN del Bootstran
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            './js/app.js'
        ]);
        // Si uno de los archivos no los encuentra nos dara error
    });

    // Si podemos leer todo del cache entonces no requerimos llegar a la Web para mostrar la informacion
    // Ademas tenemos que esperar a que toda la promesa de arriba termine para poder continuar con el siguiente paso
    event.waitUntil( cacheProm );
});

// Detectar cuando no tenemos conexion o la conexion falla
self.addEventListener('fetch', event => {

    const offlineResp = fetch( './pages/offline.html' );

    const resp = fetch(event.request)
    .catch(() => offlineResp);

    event.respondWith( resp );
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
