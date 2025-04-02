

// Detectar si podemos usar Service Workers
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js')
    // En esta promesa tenemos el registro cuando ya se instalo el SW
    // Aqui vamos a realizar un registro de una tarea asincrona cuando no hay conezion a internet
    .then( reg => {
        setTimeout(() => {
            // Supongamos que mandamos esto
            reg.sync.register('postos-offline');
            console.log('Se enviaron los datos que se hizieron Offline');
        }, 3000);
    });
    // Cuando se registre esta tarea y recuperemos la conexion a internet deberiamos de ver los mensaje del Listener SYNC
    // Para que esto funcion tenemos que cortar completamente el internet de la PC (No funciona si activamos el Offline)
    // Al cerrar el internet veremos el mensaje del Time de arriba
    // Cuando se vuelve a activar la conexion activa el Listener SYNC y los console.log, en este momento nos esta diciendo el SW
    // Que recibio una tarea asyncrona mientras no tenia conexion y ahora tiene que hacer el posteo del TAG
}

// Peticion a un endpoint (Solo lo llamamos no nos interesa lo que se haga con el )
fetch('https://reqres.in/api/users')
.then( resp => resp.text() )
.then( console.log );

// Para ver cuando se dispara el Evento SYNC tenemos que hacer esta validacion
// Si los navegadores web no soprtan esto tendriamos que revisar la conexion a interte y ahi hacer el posteo
// Primero confirmamos si existe (Esto se dejo asi para mejor aser el ejemplo de la promes de arriba)
if( window.SyncManager ){

}