const vapid = require('./vapid.json'); // Aqui metemos los datos de la llave publica y privada dentro de este objeto leyendolo con esta funcion de node

module.exports.getKey = () => {
    return vapid.publicKey;
}