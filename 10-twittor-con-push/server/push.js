const urlSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json'); // Aqui metemos los datos de la llave publica y privada dentro de este objeto leyendolo con esta funcion de node

const suscripciones = [];

module.exports.getKey = () => {
    // Retornamos nuestra llave publica de forma segura
    return urlSafeBase64.decode(vapid.publicKey);
}

module.exports.addSubscription = ( suscripcion ) => {
    suscripciones.push( suscripcion );

    console.log(suscripciones);
}