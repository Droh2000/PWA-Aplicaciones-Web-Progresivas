// Aqui pondremos la logica requerida para almacenar en el IndexDB
// Para esto usamos la libreria de PouchDB

// Creamos la instancia de la base de datos
const db = new PouchDB('mensajes');

function guardarMensaje( mensaje ){
    // Para guardar con el PouchDB tenemos que agregarle un ID al mensaje
    mensaje._id = new Date().toISOString();

    // Guardamos el mensaje (Que como nos retorna una promesa por eso ponemos el return aqui)
    return db.put( mensaje ).then((result) => {
        // Aqui tenemos el mensaje de confirmacion
        // console.log('Mensaje Guardado para posterior Posteo');

        // Tenemos que modificar la respuesta (Lo que vamos a retornar) para decirle al fronted que la tarea fue registrada en un modo Offline
        // y se va a postear apenas tengamos conexion a internet
        // Si se ejecuta este codigo es que tenemos la posibilidad de hacer posteos Offline
        // Entonces una vez lo tenemos registrado en nuesta base de datos local (Le damos el nombre entre comillas el que queramos)
        self.registration.sync.register('nuevo-post');

        // Cuando vimos el ciclo de vida, de esta manera le decimos al SW que hay una nueva tarea que se llama en este caso "nuevo-post"
        // osea hay algo nuevo que tiene que hacer apenas tenga conexion a internet (Que se llama 'nuevo-post'), con esto sabe que hay un nuevo
        // mensaje en el indexDB que nesecita ser almacenado en la BD pero a su vez queremos regresarle al APP.js (En la parte del Fetch('API'))
        // en el "then" despues de obtener en JSON la respuesta queremos que la respuesta diga que fue posteado Offline para que asi al Fronted 
        // pueda reaccionar de una forma u otra.
        // Lo que vamos a hacer es que una vez que la tarea fue registrada nus creamos una respuesta ficticia (Sabemos que la Respuesta nos regresa 
        // ok, y el mensaje), esto es lo que le vamos a mandar al fronted
        const newResp = { ok: true, offline: true };

        // Cuando se haga una peticion esta sera la respuesta que estamos creando arriba
        return new Response( JSON.stringify(newResp) );
    });


}