self.addEventListener('fetch', event => {
    // Interceptar la peticion de la imagen y en su lugar vamos a regresar otra imagen
    if( event.request.url.includes('main.jpg') ){
        event.respondWith(fetch('img/main-patas-arriba.jpg'));
    }
});

// Con cada cambio que hagamos en este archivo nos pedira en la pestana de Application que activemos el nuevo SW
// precionando en la opcion de "skipWaiting" y recargar el navegador