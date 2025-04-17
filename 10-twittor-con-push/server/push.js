const urlSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json'); // Aqui metemos los datos de la llave publica y privada dentro de este objeto leyendolo con esta funcion de node

// Para hacer que las suscripciones se mantengan persistentes y no se pierdan
// Esto nos permite crear archivos de texto
const fs = require('fs');

const webpush = require('web-push');

// Esto es para estar informados si los servicios cambias, si la app cambia, esto lo recibimos en el mail que pongamos
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    // Estas son nuestras llaves
    vapid.publicKey,
    vapid.privateKey
);

// Para que las suscrpiciones se mantengan aunque reiniciemos el navegador, iniciamos el arreglo en el archivo donde almacenamos las suscripciones
// El archivo tiene que tener datos o nos dara error, sino dentro podemos especificar [] vacios
// En la vida real esto se guarda en la base de datos y de ahi se lee
let suscripciones = require('./subs-db.json');

module.exports.getKey = () => {
    // Retornamos nuestra llave publica de forma segura
    return urlSafeBase64.decode(vapid.publicKey);
}

module.exports.addSubscription = ( suscripcion ) => {
    suscripciones.push( suscripcion );

    //console.log(suscripciones);

    // Guardamos la suscripcion en un archivo, este lo queremos guardar en la carpeta Server
    // y al archivo le damos el nombre de "subs-db.json" y le pasamos las subscripciones
    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones));
}
// Si cancelamos las notificacion y las volvemos a activar nos debe de crear mas suscripciones en el mismo archivo pero
// por defecto tendremos un error, y es que en el momento que guardamos el archivo de "subs-db.json" eso reinica el proceso
// del servidor entonces borra el archivo anterior y crea el nuevo archivo con la nueva suscripcion. Para arreglarlo en el PAckage.json
// le decimos que ignore cualquier archivo con la extencion .JSON

// Entre parentesis le pasamos la informacion que queremos enviar en la notificacion
module.exports.sendPush = ( post ) => {
    console.log('Mandando PUSHES');

    // Como el envio de notificaciones push se hace muy rapido y requerimos esperar a que todas las notificaciones terminen antes de continuar a hacer otra cosa
    // Para lograr esto metemos cada una de las promesas en un arreglo
    const notificacionesEnviadas = [];

    // Les vamos a mandar un mensaje a todas las suscripciones que tenemos en el arreglo de suscripciones
    // Aqui nos interesa obtener la pocicion "i" para poder eliminar las suscripciones que no nos sirven 
    suscripciones.forEach( (suscripcion, i) => {
        // Adentro tenemos la suscripcion a la que le podemos mandar notificacion y la informacion que le queremos mandar
        // La propiedad "titulo" es la que estamos leyendo del POST del "/push", en un inicio mandamos el titulo
        // pero en el Post tenemos bastante informacion y eso es lo que mejor mandamos
        const pushProm = webpush.sendNotification( suscripcion, JSON.stringify(post) )
        .then( console.log('Notificacion Enviada') )
        .catch( err => {
            console.log('Notificacion Fallo');
            // El codigo para saber que algo ya no existe es 410
            if( err.statusCode === 410 ){
                // Aqui borramos las suscripciones que ya no existan, gracias al bucle tenemos la posicion del index
                // Pero tenemos que marcar primero las nnotificacion que queremos borrar porque si lo hacemos aqui directamente
                // recorrera de mas o de menos posiciones
                // Aqui le agregramos una nueva propiedad y le asignamos que es True
                suscripciones[i].borrar = True;
            }
        });

        notificacionesEnviadas.push(pushProm);
    });

    // Borramos las notificaciones que ya no valen
    Promise.all( notificacionesEnviadas ).then( () => {
        // Regresamos todas las suscripciones que no tengan la pripiedad de Borrar
        suscripciones = suscripciones.filter( subs => !subs.borrar );

        // Tenemos que sobrescribir el archivo que tenemos en la BD donde almacenamos las suscripciones .JSON
        fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones));
    });
}