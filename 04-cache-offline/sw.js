
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
const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
// Podemos considerar el cache inmutable (En este se meteria por ejemplo los del boostrap, ya que como estos archivo no van a cambiar nunca)
const CACHE_INMUTABLE_NAME = 'imutable-v1';
const CACHE_DYNAMYC_LIMIT = 50;

// Tenemos que ser optimos manejando el Cache, supongamos que solo queremos limitar a 5 archivos en el cache Dinamico y que los demas
// que los sirva por la Web, cada navegador tiene un espacio limitado y en la version de celulares mas
// Hacemos que esta funcion funcione para cualquier cache, luego le especificamos cuando items queremos mantener en el cache
const limpiarCache = ( cacheName, numeroItems ) => {
    // Primero tenemos que abrir el cache para ver que hay adentro
    caches.open( cacheName )
        .then(  cache => {
            // Recorremos todos los eleemntos que esten dentro de ese cache
            // Aqui mismo vamos a requerir leer el cache por eso hacemos todo en la misma funcion
            cache.keys()
            .then( keys => {
                // Estos Keys serian cada uno de los elementos que estan almacenados dentro del cache en forma de Request donde se ubican los archivos
                //  console.log(keys);

                // Verificamos si ya alcamos el limite de archivos
                if( keys.length > numeroItems ){
                    // Aqui tenemos que borrar algo, sabemos que tenemos elementos en el cache, ademas vamos a hacer que se eliminen de forma recursiva
                    // los elementos que excedan esa cantidada, eliminando todo la pocion 0 hasta que ya no se cumpla la condicion
                    cache.delete( keys[0] )
                    .then( limpiarCache(cacheName, numeroItems) );
                }
            });
        });
    // Para probar esta funcion tenemos que despues de recargar el navegador, ir al cache donde se implemento la funcion y borrar todos sis elementos
    // despues de volver a recargar el navegador, se ejecutara la funcion
}


// Para actualizar este cache tenemos que volver a ejecutar la instalacion, de manera rapida subirmos la version del cache
// lo que hara un cambio en general del SW, PERO Seguiremos sin ver los cambios en la pagina, podremos recargar la pagina, precionar el SkipWaiting pero no funcionara
// Esto pasa porque al cambiar de version tenemos dos caches "static-v1" y el "static-v2" y en los dos existe un Index.html, esto el navegar lo interpreta que cuando va 
// al metodo del "caches.match" de la estrategia "Cache With Network Faillback" le decimos que no importa en cual cache busque, que obtenga los archivos, solo eso 
// Asi que tenemos que elimina el cache viejo "static-v1" y al recargar ya veremos la imagenes
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
            './js/app.js',
            './img/no-img.jpg',
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
    // Esto solo se actualizar si no existe en el cache el archivo 
    /*const respCache = caches.match( event.request )
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

                            // Un buen lugar para poner la funcion de limpieza es cuando estamos guardando en el cache
                            // Despues de poner el registro nuevo vamos a limpiar y limitar el cache a 5 elementos
                            limpiarCache( CACHE_DYNAMIC_NAME, 5);
                        });

                    // Si no la clonamos nos dara error porque la respuesta la estamos usando dos veses que es arriba y aqui abajo 
                    return newResp.clone();
                })
        });
        // Cuando probamos, recordemos que en la primera recarga de la pagina se instala el SW con todo los elementos del cache. tenemos que borrar los archivos del cache
        // y volver a recargar la pagina para verificar si esta funcionando la implementacion
        // Despues de la aplicacion de los otros cache, para probar este cache solo hay que eiminar elementos de los otros caches y cuando se recarge el navegador se creara este cache dinamico
    */

    // Cache Network With Cache Fallback
    // Primero vaya a internet, que intenten obtener el recurso y si lo obtiene que lo muestre, si no lo obtiene que vaya al cache haber si existe
    /*const respCache = fetch( event.request ).then( res => {
        // Para probar este console, vayamos al index y pongamos un archivo que no exista
        // Veremos que en la consola nos da 404, esto lo tenemos que pregnutar con el IF (Si la respuesta no existe que intente leerlo del cache)
        if( !res ) return caches.match( event.request );
        // console.log('Fetch', res);
        // Para una imagen que no exista podriamos mandar un recurso por defecto

        caches.open( CACHE_DYNAMIC_NAME )
        .then( cache => {
            // Aqui obtenemos el recurso entonces lo almacenamos en el cache
            cache.put( event.request );

            // Para que el cache no cresca descrontoladamente
            limpiarCache( CACHE_DYNAMIC_NAME, CACHE_DYNAMYC_LIMIT);
        });
        // Esta es la respuesta que mostramos si la encuentra
        return res.clone();
    })
    // Para el caso que el usuario no tenga conexion a internet, solo nos toca revisar si existe en el cache
    .catch( err => {
        // Si existe algo en el cache que haga match con la peticion que le estamos mandando
        return caches.match( event.request );
    });
    // Si nos vamos a la pestana de Network y vemos en la tabla en la columna de "Initiar" para ver cuando el SW realiza la peticion
    // si vemos que en la columna "Size" hay un peso quiere decir que se fue a la Web y consiguio la descarga
    // Despues aparecen los mismos recursos pero ahora desde el SW esto es porque aqui pusimos que el SW es el que hace el fetch y el SW es
    // el que le responde al navegador con la respueta de abajo
    // Problemas que tiene esta estrategia es que cuando estamos en un dispositivo movil SIEMPRE va a intentar traer la informacon mas actualizada y esto conlleva
    // a que al hacer siempre el Fetch siempre consume datos y ademas esta estrategia es mas lenta que el Cache First
    // En esta estrategia siempre tiene que hacer una descarga
    event.respondWith(respCache);*/

    // Cache With Network Update
    // Esto es cuando nuestro rendimiento es critico y necesitamos que aparesca lo mas rapido en nuestra aplicacion y tambien nos interesan las actualizaciones pero 
    // estas siempre estaran una version atras de la version que tenga el navegador web
    // Si por ejemplo modificamos el indez y ocultamos los SRC de las imagenes, si recaargaramos el navegador web, este nos mostraria la pagina exactamente como estaba antes 
    // porque esta en el cache pero una vez que se hace la peticion al recurso, nosotros hacemos una actualizacion en el background para que cuando el usuario vuelva a consular 
    // la pagina vuelva a tener la nueva version, sin hacer modificaciones en el SW
    // Como el Boostrap lo estamos tomando de otro cache empleamos esta condicion porque sino no lo estariamos tomando
    /*if(event.request.url.includes('bootstrap')) {
        return event.respondWith( caches.match( event.request ));
    }

    // Como el rendimiento es critico vamos a trabajar unicamente con la informacion que esta en el cache que no cambia
    const respCache =caches.open( CACHE_STATIC_NAME ).then( cache => {
        // En esta estrategia todo lo que se requiere esta en el cache, no tenemos nada dinamico
        // Con fetch vamos a internet donde esta la informacion y obtenga, esa nueva respuesta
        fetch( event.request ).then( newRes => {
            // Actualizamos el cache metiendole la nueva informacion 
            cache.put( event.request, newRes );
        }); 
        // Regresamos lo que coincida en el cache para que eso sea lo que se implemente
        return cache.match( event.request );
    });*/
    /*
        En este caso hizimos que busque el cache con el nombre de "CACHE_STATIC_NAME", cuando se abra
        le decimos que nos regrese lo que coincida con la peticion que nos esta pidiendo el usuario
        A su vez ejecutamos el Fetch para obtener la ultima version que se encuentra en el lugar donde
        estamos sirviendo la aplicacion, esto lo almacenamos en el cache
        Se almacena ahi pero es servida la version que teniamos en el cache originalmente
        (La peticion del Fetch se va a hacer despues del RETURN porque en este caso es mas lentos que 
        solo leer el cache y retornarlo)

        Para ver el funcionamiento del cache
        Modifiquemos el index.html, al recargar el navegador veremos que no salen los cambios porque nuestro cache no cambio
        Lo que hizo en la recarga del navegador fue traer los datos del cache porque es mas rapido pero tambien actualiza el cache
        por eso si actualizamos nuevamente el sitio, esta vez si veremos los cambios
    */
    //  event.respondWith(respCache);

    // Cache y Network Race
    // Este es como una competencia para ver cual de los dos responde primero, asi le daremos al usuario la respuesta mas rapida en 
    // alguna de estas peticiones
    // Nos creamos una promesa que se encarge de hacer esto simultaneamente
    const respCache = new Promise( (resolve, reject) => {
        // Bandera para saber cual de las dos fue rechazada
        let rechazada = false;

        const falloUnaVez = () => {
            // Evaluamos si la peticion fue rechazada
            if( rechazada ){
                // En esta parte quiere decir que no existe en el cache ni exte una peticion valida del Fetch
                // Lo que se hace varia, si fuera una imagen la fallenta podemos retornar una imagen por defecto
                // Aqui le pasamos un expreccion regular
                if(/\.(png|jpg)$/i.test( event.request.url )){
                    resolve( caches.match('/img/no-image.jpg') );
                }else{
                    reject('No se encontro respuesta');
                }
            }else{
                // Si no ah sido rechazada quiere decir que fue la primera que fallo
                rechazada = true;
            }

            // Veamos la logica:
            // Supongamos que el Fetch falla primero y entra al codigo de esta funcion, como al inicio la bandera vale False
            // entonces entra al ELSE, pero el cache todavia no ah respondido 
            // Si el cache falla tambien entra a esta funcion y como la bandera ya esta true entra dentro del IF
        }

        // Ponemos a competir el cache y network haber cual de las dos se hace primero
        fetch( event.request ).then( res => {
            if( res.ok ){
                // Regresamos la repuesta obtenida
                resolve(res);
            }else{
                // Si no logra resolver llamamos la funcion de fallo (Puede que el recurso no se encontre)
                falloUnaVez();
            }
        })
        // Si no tenemos conexion a internet, se va a disparar el catch
        .catch( falloUnaVez ); // No le ponemos los parentesis para que ejecute la funcion loluego

        // Buscamos la respuesta en el cache
        caches.match( event.request ).then( res => {
            // Si la encontramos la regresamos
            if( res ){
                resolve(res);
            }else{
                // Si no obtenemos la repuesta
                falloUnaVez();
            }
        });
    }).catch( falloUnaVez );

    // Para provar esta estratiegia
    // Vamonos a la pestana Cache Storage -> staticv2 y eliminamos la imagen para que entre al IF de la funcion de fallo y nos ponga
    // la imagen por defecto porque ya no existe la imagen, recargamos el navegador y nos sale la imagen
    // Debemos estar en modo offline para ver esto
    event.respondWith(respCache);
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
