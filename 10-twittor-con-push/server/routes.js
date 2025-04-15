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
  res.json('');
});

module.exports = router;