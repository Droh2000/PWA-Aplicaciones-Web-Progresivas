
// Detectar cuando no tenemos conexion o la conexion falla
self.addEventListener('fetch', event => {

   // Ahora vamos a mandar un HTML para que se mire mejor la respuesta
   /*const offlineResp = new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Sin conexion</title>
            
        </head>
        <body class="container p-3">
            <h1>Estas en modo Offline</h1>
        </body>
        </html>
    `, {
        // Convertimos la respuesta a HTML
        headers: {
            'Content-Type':'text/html'
        }
    });*/

    // Como estamos intentando acceder a un HTML de manera Offline no podemos usar el Fetch ya que por defecto
    // es una peticion que se van al HTTP con conexion a internet por lo que esto fallaria, para eso estan las estrategias del cache
    const offlineResp = fetch( './pages/offline.html' );

    const resp = fetch(event.request)
    .catch(() => offlineResp);

    // Tenemos que regresar una respuesta valida que el navegador pueda interpretar
    event.respondWith( resp );
});

// Recordemos que despues de cada cambio:
//  Pestana de Application -> Service Worker -> SkipWaiting (Aqui esta la opcion de offline para simular que no hay conexion)
