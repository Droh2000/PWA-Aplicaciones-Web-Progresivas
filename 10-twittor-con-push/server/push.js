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
const suscripciones = require('./subs-db.json');

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
    // Les vamos a mandar un mensaje a todas las suscripciones que tenemos en el arreglo de suscripciones
    // Aqui nos interesa obtener la pocicion "i" para poder eliminar las suscripciones que no nos sirven 
    suscripciones.forEach( (suscripcion, i) => {
        // Adentro tenemos la suscripcion a la que le podemos mandar notificacion y la informacion que le queremos mandar
        // La propiedad "titulo" es la que estamos leyendo del POST del "/push"
        webpush.sendNotification( suscripcion, post.titulo );

    })
}