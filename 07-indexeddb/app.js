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

// Manejo de errores (Esto se ejecutara cuando ocurra un error)
request.onerror = event => {
    console.log('Db error', event.target.error );
}

// Insertar Datos
request.onsuccess = event => {
    let db = event.target.result; // Referencia a la base de datos
    
    // Informacion que queremos meter a la BD local
    let heroesData = [
        {id: '1111', heroe: 'Spiderman', mensaje: 'Aqui su amigo arana'},
        {id: '2222', heroe: 'Ironman', mensaje: 'Aqui cagando en el bano'},
    ];

    // Para guardar nos tenemos que crear una transaccion
    // Como argumentos le mandamos el lugar donde queremos guardar, luego tenemos que especificar si la transaccion es de lectura o lectura y escritura
    // (Si solo queremos leerlo seria "readonly")
    let heroesTransaction = db.transaction('heroes', 'readwrite');

    // Como podria fallar hay que manejar el error
    heroesTransaction.onerror = event => {
        console.log('Error Guardando', event.target.error);
    }

    // Si la transaccion se hace correctamente
    heroesTransaction.oncomplete = event => {
        console.log('Transaccion Hecha', event);
    }

    // Requerimos un objeto de esa transaccion (Este es el lugar donde vamos a almacenar)
    let heroesStore = heroesTransaction.objectStore('heroes');

    // Recorremos el arreglo para insertar sus registros uno por uno
    for ( let heroe of heroesData ){
        heroesStore.add( heroe );
    }

    // Si la inserccion se hizo correctamente
    heroesStore.onsuccess = event => {
        console.log('Nuevo item agregado a la base de datos');
    }
    // Para ver los datos nos vamos a la pestana de Application -> IndexDB -> BD -> heroes
}   


