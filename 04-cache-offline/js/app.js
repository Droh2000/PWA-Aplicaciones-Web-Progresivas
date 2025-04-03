

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

/*
    Cache Storage
        Es parte del objeto window.caches
    Los caches creados salen en: Application -> Cache Storage -> Aqui dentro estan los que creamos con la funcion "Open()"

    Primero validamos si el usuario puede usar el cache en su navegador, si estubieramos dentro del SW no haria falta
    verificar el cache porque si soporta el SW entonces soporta el Cache
*/
if( window.caches ){
    // Aqui le decimos que vaya al cache (Es un espacion del almacenamiento del usuario) y que tinte abrir el espacio con ese nombre y 
    // si no existe lo va a crear (este es el espacio donde almacenaremos informacion)
    caches.open('prueba-1');

    // Comprobar si un cache existe, esto nos regresa un promesa
    // Dentro del then tenemos el True o False
    caches.has('prueba-2').then( console.log );

    // Eliminar un cache 
    // Por como esta la logica aqui, cada vez que recargamos el navegador web, lo creamos y lo borramos
    caches.delete('prueba-1').then( console.log );

    caches.open('cache-v1.1').then( cache => {
        // Aqui tenemos acceso a los archivos y el cache a si mismo
        // Queremos almacenar aqui el index.html
        //      cache.add('/index.html');

        // Hay otra opcion para agregar multiples archivos
        cache.addAll([
            '/index.html',
            '/css/style.css',
            '/img/main.jpg'
        ])
        // De esta forma aunque no tenga a conexion el usuario pero los archivos existen en este espacio, se podran mostrar
        // Si queremos borrar archivos en especificos (Al ser una promesa tenemos que esperar a que se graben para poder eliminarlos)
        .then(() => {
            cache.delete('/css/style.css');

            // Queremos remplazar uno de los archivos por otra cosa (Asi remplazamos cualquier cosa del cache)
            cache.put( 'index.html', new Response('Hola Mundo') );
        });

        // Leer un archivo que se encuentra en el cache
        // Primero preguntamos si existe el archivo (Con Match())
        cache.match('/index.html')
        .then( resp => {
            // Leemos la respuesta y la imprimimos en consola
            resp.text().then(console.log );
            // De aqui podriamos mandar esta respuesta al HTML que queriamos mostrar Offline
            // Tambien podemos remplazar los elementos en el Cache por informacion que se encuentre mas actualizada a la Web
            // para que asi el usuario tenga los datos mas recientes y se muestren actualizados del cache
        });
    });

    // Obtener todos los caches que existen
    caches.keys().then( keys => {
        console.log(keys)
    });

}