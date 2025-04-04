// Aqui vamos a ver que de las estrategias del cache podemos extenderlas en sus funcionalidades segun nuestras necesidades
const CACHE_STATIC_NAME  = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_DYNAMIC_LIMIT = 50;

function limpiarCache( cacheName, numeroItems ) {
    caches.open( cacheName )
        .then( cache => {
            return cache.keys()
                .then( keys => {
                    if ( keys.length > numeroItems ) {
                        cache.delete( keys[0] )
                            .then( limpiarCache(cacheName, numeroItems) );
                    }
                });           
        });
}

self.addEventListener('install', e => {
    const cacheProm = caches.open( CACHE_STATIC_NAME )
        .then( cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
                '/img/no-img.jpg',
                // Si una pagina se solicita y no esta cargada, esta pagina es la que vamos a mostrar
                'pages/offline.html',
            ]);
        });

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
            .then( cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );
});

// Estrategia: Cache With Network Fallback
// En esta estrategia si no tenemos conexion a internet y no esta los datos en el cache, entonces fallara todo
// Si activamos el modo offline veremos que podemos hacer las navegaciones entre paginas pero si vamos al cache dinamico
// (En el navegador) y borramos los archivos y navegamos a la pagina dos, la aplicacion revienta (Para solucionar esto implementamos lo del catch)
self.addEventListener('fetch', event => {
    const respCache = caches.match( event.request )
        .then( res => {
            if( res ) return res;
            
            return fetch( event.request )
                .then( newResp => {
                    caches.open( CACHE_DYNAMIC_NAME )
                        .then( cache => {
                            cache.put( event.request, newResp );

                            limpiarCache( CACHE_DYNAMIC_NAME, 50);
                })
                // Vamos a resolver los problemas cuando no hay conexion a internet
                .catch( err => {
                    // Buscamos la pagina para mostrar cuando no hay conexion
                    // Debemos de emplear validaciones porque esto es solo para cuando fallan las paginas pero no para cuando 
                    // fallan otros tipos de archivos como CSS, imagenes, entre otros
                    
                    // Esta es una forma de detectar si viene una pagina web
                    if( e.request.headers.get('accept').includes('text/html') ){ // Si lo que se solicita es una pagina web
                        caches.match('/pages/offline.html');
                    }
                });

                return newResp.clone();
        });
    });
    event.respondWith(respCache);
});