const express = require('express');

const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Directorio Público
// Esta instruccion toma la carpeta publica y la expone a internet cuando accedamos a cierto url
app.use(express.static(publicPath));

// Rutas 
// Esta es la configuracion de rutas que tenemos en el archivo "routes"
const routes = require('./routes');
// Para acceder a los Endopints se iniciaran con el /api
app.use('/api', routes );



app.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});