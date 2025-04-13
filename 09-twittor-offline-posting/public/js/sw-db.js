// Aqui pondremos la logica requerida para almacenar en el IndexDB
// Para esto usamos la libreria de PouchDB

// Creamos la instancia de la base de datos
const db = new PouchDB('mensajes');

function guardarMensaje( mensaje ){
    // Para guardar con el PouchDB tenemos que agregarle un ID al mensaje
    mensaje._id = new Date().toISOString();

    // Guardamos el mensaje
    db.put( mensaje ).then((result) => {
        // Aqui tenemos el mensaje de confirmacion
        console.log('Mensaje Guardado para posterior Posteo');
    });


}