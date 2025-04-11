/*
    IndexDB es una base de datos local, usando JS puro es complicado lo que ah hecho
    que muchas librerias surgan para facilitar su uso 
*/

// Requerimos crear el espacio de la base de datos, Entre comillas le pasamos el nombre de la BD
// despues podemos especificar el numero de version que es opcional, esto nos ayuda si hubo cambios en la BD
// y requerimos mantener la compatibilidad de la aplicacion con la nueva
let request = window.indexedDB.open('mi-database', 1);

// Cuando modificamos cualquier cosa de la BD o la actualizamos, tenemos que manejar todos los request
// o todos los listeners manualmente y es cuando se cumplica la cosa
request.onupgradeneeded = event => {
    console.log('Actualizacion de la BD');
    // Aqui adentro vamos a poder tener la referencia a la BD
    let db = event.target.result;

    // En esta base de datos vamos a almacenar los mensajes y los heroes que va a estar usando la aplicacion
    // Supongamos que es la aplicacion pasada y vamos a almcenar una llave para que solo con esta se puedan
    // guardar registro en la BD
    // Este es el espacio donde vamos a almacenar la informacion referente a los heroes, y esto recibe un segundo argumento
    // que son las opciones o parametros 
    db.createObjectStore('heroes', {
        keyPath: 'id'
    });
// Este codigo se va a disparar cuando se crea o se sube de version la BD
// Las versiones solo hay que cambiarlas cuando es nesesario, ademas si actualizamos el navegador y no vemos nada es porque anteriormente
// ya se habia creado la BD, asi que para ver la ejecucion tenemos que subir de version o eliminarla dentro del navegador
}




