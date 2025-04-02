
/*
    Cuando es la primera vez que nuestra pagina web carga, ahi es cuando trae
    el archivo del SW que registra con el comando ".register" que esta en el archivo
    de JS, si no existe ningun SW anterior, se descarga, se instala y luego se activa

    Durante el proceso de la instalacion podemos hacer cosas
    Este Listener se va a disparar cada vez que ocurra un cambio menor en el SW
*/
self.addEventListener('install', event => {
    // En este proceso normalmente se realiza la descarga de archivos externos como CSS, JS
    // Tambien aqui se crea el Cache, si mostramos este mensaje, veremos que se visualiza 
    // lo luego al recargar el navegar sin antes preciona el SkipWaitting porque al ser un Nuevo SW 
    // Empieza esta fase de Instalacion (Si volvemos a recargar el navegador ya no sale el mensaje 
    // ya que el navegador sabe que es el mismo SW que antes)
    console.log('Instalando el Service Worker');

    // Esto es por si queremos que el nuevo SW tome el control inmediatamente despues que se instala
    // y que no se espera a que el cliente cierre todo el navegador o precionar el SkipWaiting
    // Igual usar esto puede hacer que se pierda informacion que los clientes tienen o estan esperando
    //      self.skipWaiting();

    /*
        Usualmente cuando hacemos la instalacion o la activacion o recibimos una notificacion PUSH
        o tratamos de sincronizar datos con el servidor cuando se recupera la conexion a internet
        todo esto el SW lo ejecuta muy rapido, pero no todos los pasos se ejecutan tan rapido como 
        cargar informacion al cache, entonces en ese caso el evento que contiene esa tarea se ejecuta
        mas lento y los demas se tienen que esperar a que termine sus tareas

        Supongamos que este time, hace la tarea de instalacion donde simularemos que guardar en el cache demora
        un segundo
    */
    const instalacion = new Promise( (resolve, reject) => {
        setTimeout(() => {
            console.log('SW: Instalacion terminadas');
            resolve(); // lamamos para indicar que se termino la promesa
        }, 1000);
    });

    // Asi como tenemos esto, veremos en consola que primero se ejecuta, el listanaer de install, luego el listener de activated
    // y al final nos muestra este mensaje del Time, deberiamos de hacer a que las instalaciones terminen para que se pueda ir a la activacion
    // Para solucionarlo en todos los eventos existe el metodo ".waitUntil()" y se le pasa una promesa
    event.waitUntil( instalacion );
});

// Este listener se ejecuta cuando el SW se activa
self.addEventListener('activate', event => {
    // Usualmente esto se usa para borrar cache viejo que es cuando el antiguo Sw murio y ya no queremos mantener sis caches
    // Este mensaje solo se muestra la primera vez, si volvemos a recargar el navegador no se tiene porque activar lo que ya esta activo
    console.log('SW activo y listo para controlar la aplicacion');
});

// Listener para el manejo de peticiones HTTP, intercepcion de recursos de la aplicacion
self.addEventListener('fetch', event => {
    // Aqui es donde se aplican las estrategias del cache, determinamos si dejamos algo almacenado o mejor lo tomamos directamente de la web
    // En este mensaje veremos que es atrapada la peticion HTTP de archivo "app.js"
    console.log( 'SW', event.request.url );

    // Verificamos si la peticion es la del API entonces vamos a manejar la respuesta diferente
    if( event.request.url.includes('https://reqres.in/') ){
        // Creamos una nueva respuesta
        const resp = new Response(`{ ok: false, mensaje: 'jajaja'}`);

        // Con esto veremos que se hace la solicitud HTTP pero el SW nos regresa otra cosa
        event.responseWith( resp );
    }
});

// Este se usa cuando perdimos la conexion y la recuperamos (Se usa para hacer las peticiones HTTP offline)
self.addEventListener('sync', event => {
    console.log('Tenemos conexion',event)
    // Normalmente cuando queremos hacer posteo y se puede hacer en segundo plano, se le tiene que 
    // asignar una etiqueta que sera el identificador para que cuando se recupere la conexion y se dipare este evento SYNC
    // vamos a revisar por tags lo que quedriamos realizar, esto se hace tomando la base de datos IndexedDB donde se almacenan
    // las peticiones para activarse hasta que se tiene la conexion a internet
    console.log(event.tag);
});

// Para manejar las Push Notification: si se las queremos mandar a todos los usarios o solo a unos cuantos
self.addEventListener('push', event => {
    // Para ver este mensaje tenemos que ir a la pestana de Application - Service Worker y ahi encontramos
    // el boton que dice Push que al precionarlo veremos el mensaje
    console.log('Notificacion recibida');
});