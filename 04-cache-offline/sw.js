
// Detectar cuando no tenemos conexion o la conexion falla
self.addEventListener('fetch', event => {

    // Creamos una respuesta manual para cuando no hay internet
    const offlineResp = new Response(`
        Bienvenido a la pagina web

        Se requiere internet para usarla 
    `);

    // Vamos a hacer que para cada peticion Fetch regrese exactamente el mismo recurso que pide el cliente
    // pero es el SW el que va a realizar la peticion (En este punto todos los recursos son servidos del SW y es este quien hace la peticion)
    const resp = fetch(event.request)
    // Si no logra cargar los recursos (Se dispara el catch cuando al accceder al Fetch no se tiene conexion a internet)
    .catch( () => {
        // Aqui tenemos que regresar una respuesta
        return offlineResp;
    });


    // Tenemos que regresar una respuesta valida que el navegador pueda interpretar
    event.respondWith( resp );
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
