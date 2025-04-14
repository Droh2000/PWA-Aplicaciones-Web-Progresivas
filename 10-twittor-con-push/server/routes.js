// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();


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
router.get('/key', (req, res) => {
  res.json('key publico');
});

// Para Enviar una notificacion PUSH a las personas que nosotros queramos
// Normalmente esto no es mediante un servicio REST ya que es algo que se controla del lado del Server
// No es un servicio que este expuesto sino solo algo que corra en el backend pero para fines de aprendisaje lo colocamos
router.post('/push', (req, res) => {
  res.json('');
});

module.exports = router;