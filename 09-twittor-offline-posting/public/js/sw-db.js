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

function postearMensajes(){
    const posteos = []; // Aqui almacenmos todo los posteos que tenemos que hacer a la base de datos

    // Recorremos todos los documentos que tengamos en la base de datos local, le pasamos True para que incluya los documentos
    // Esto es lo que le mandamos al SW
    return db.allDocs({ include_docs: true }).then( docs => {
        // Aqui no tenemos directamente los documentos sino que tenemos el indicador que nos dice la cantidad de registros entre otras cosas
        // y dentro vienen las filas (entonces recorremos cada una de esas filas)
        // Cada una de estos FetchApi tenemos que esperar a que se terminen
        docs.rows.forEach(row => {
            // Extraemos el documento que se encuentra dentro del Row
            const doc = row.doc;

            // Ese Doc es ya la informacion que se quiere postear y tenemos que disparar el Fetch como metodo Post
            const fetchProm = fetch('api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( doc )
            }).then(res => {
                // Si la respuesta Falla como esto estara dentro del Evento SYNC este lo intentara hasta que tenga exito
                // Si estamos aqui es que ya realizo el posteo en ese caso tenemos que borrar el registro del Row de la base de datos local
                // porque ya se posteo y si tubieramos otro posteo offline  se volveria a crear el registro
                return db.remove( doc ); // Para que nos regrese la promesa y se almacene en la constante
            });

            // Almacenamos los Posteos
            posteos.push( fetchProm );

            // Tenemos que esperar a que todas las promesas que esten dentro del este posteo Terminen
        });

        // Asi espera a que todas las promesas esperara a que se resuelvan
        return Promise.all( posteos );

    });
}