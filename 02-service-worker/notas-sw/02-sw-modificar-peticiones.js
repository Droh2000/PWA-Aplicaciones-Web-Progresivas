self.addEventListener('fetch', event => {
    // Queremos modificar la peticion que estamos haciendo al Style.css
    if( event.request.url.includes('styles.css') ){
        
        // Vamos a regresar un nuevo estilo (Todas estas modificaciones se pueden hacer desde el SW, en la vida real
        // estos datos los vamos a tomar del cache para darselos al usuario)
        // Creamos esta variable con este objeto que es el resultado de cualquier peticion FETCH
        const resp = new Response(`
            body {
                background-color: red !important;
                color: pink;
            }
        `, {
            // Para indicar que la repuesta es un archivo CSS tenemos que modificar el Header
            headers: {
                'Content-Type':  'text/css'
            }
        });

        // Esta respuestra se regresera cuando se hace una peticion al Style CSS
        event.respondWith( resp );
    }
    // Este es un ejemplo de que podemos manipular las peticiones 
    // Si hacemos doble click en el archivo de la peticion que aparece dentro de la pestana de Network

});

// Con cada cambio que hagamos en este archivo nos pedira en la pestana de Application que activemos el nuevo SW
// precionando en la opcion de "skipWaiting" y recargar el navegador