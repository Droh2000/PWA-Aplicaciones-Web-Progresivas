
// Detectar cuando no tenemos conexion o la conexion falla
self.addEventListener('fetch', event => {

   
    const offlineResp = fetch( './pages/offline.html' );

    const resp = fetch(event.request)
    .catch(() => offlineResp);

    event.respondWith( resp );
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
