// Este es el archivo del Service Worker donde estara toda su logica

// Este mensaje solo sale la primera vez, una vez recargado el navegador ya no sale porque el SW ya se instalo
// Cuando el navegador interpreta la instruccion de "serviceWorker.register" en el archivo "app.js" ya detecta que es 
// el mismo SW y no lo instala
// console.log('Activo el SW');

// El Sw solo va a contrner codigo que controle lo que pasa en la aplicacion
// Con self -> Hacemos referencia al SW
// Dentro del metodo le especificamos que accion es la que tomara cuando suceda un evento
// Evento "fetch" -> Es para tomar todas las peticiones que el navegador hace, por ejemplo en el Index:
//                  Los SRC de del JS e IMG, los HREF a los estilos de boostrap o de CSS
//                  Todas estas peticiones las vemos en la pestana de Network
// Despues la funcion que contendra la logica que se ejcutar al suceder el evento 
self.addEventListener('fetch', event => {
    // Aqui veremos las peticiones que hace el navegador a los archivos del proyecto y archivos importados como los CDN de bootstrap
    //      console.log(event);

    // Bloquear la peticion a un recurso del proyecto (Para que el SW no lo use)
    if( event.request.url.includes('style.css') ){
        // Simulamos un 404 (En la pestana Network veremos que nos da error)
        event.respondWith( null );
    }else{
        // Aqui le decimos que la respuesta del nuevo evento sera lo que venga al hacer la peticion, es como recibir los datos de la solicitud
        // y el SW la ejecuta y eso es lo que regresa (Esto lo vemos en la pestana de Network donde los archivos como CSS y JS los toma del SW)
        // estas son peticiones que salieron del SW y fue el SW el que hico el Fetch a esa direccion
        event.respondWith(fetch(event.request));
    }
});

// Con cada cambio que hagamos en este archivo nos pedira en la pestana de Application que activemos el nuevo SW
// precionando en la opcion de "skipWaiting" y recargar el navegador