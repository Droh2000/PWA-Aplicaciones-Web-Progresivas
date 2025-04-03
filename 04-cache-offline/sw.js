
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
            // Si no especificamos el Slash que va despues del dominio porque si no al implementar el cache nos dara error
            // ya que los usuario pueden entrar por el Slash o Index 
            './',
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
    event.respondWith( caches.match( event.request ) ); // Con esto si activamos el Offline la pagina seguira funcionando

    // La desventaja de esta estrategia es que se tiene que actualizar el SW para actualizar los archivos almacenados en el cache 3
    // pudiendo hacer que si el usuario accede a recursos que no estan en el cache, le dara error en toda la aplicacion
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
