// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');

const mensajes = [

  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensaje
router.post('/', function (req, res) {
  
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push( mensaje );

  console.log(mensajes);


  res.json({
    ok: true,
    mensaje
  });
});

// Configuracion de las rutas nesesarias

// Para almacenar la subscricion (Aqui manejamos cuando el cliente se subscriba)
router.post('/subscribe', (req, res) => {
  const suscripcion = req.body;
  //console.log( suscripcion );
  // Con esta subscripcion la tenemos que almacenar en una base de datos donde podramos mantenerla 
  // en algun caso que el servidor se reinicie (Por el momento vamos a hacer una coleccion de todas estas suscrpciones)
  // Usamos el modulo push para el manejo de la Key
  push.addSubscription( suscripcion );

  res.json('subscribe');
});

// Para obtener la llave publica
// Retonamos la llave publica para probar
router.get('/key', (req, res) => {
  // Nos creamos un modulo llamado Push para no mesclarlos con lo que son de las rutas 
  const key = push.getKey();
  // No requerimos pasarla como un JSON sino como un arrayBuffer, como esta conversion ya la hicimos 
  res.send(key);
});

// Para Enviar una notificacion PUSH a las personas que nosotros queramos
// Normalmente esto no es mediante un servicio REST ya que es algo que se controla del lado del Server
// No es un servicio que este expuesto sino solo algo que corra en el backend pero para fines de aprendisaje lo colocamos
router.post('/push', (req, res) => {
  // Cuando llamemos el servicio Push vamos a extraer la informacion que viene en el POST
  // Esto lo probamos en el Postman con la opcion de "x-www-form-urlencoded" donde definimos las propiedades que queremos enviar
  // Estas son las priopiedades que definimos
  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  }

  push.sendPush( post );

  res.json(post);
});

module.exports = router;