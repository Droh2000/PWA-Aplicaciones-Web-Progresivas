// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();

// Estos mensajes los almacenamos en un arreglo para que la cosa sea sencilla
// La idea es que cada vez que el usario escriba un comentario dentro de uno de los personajes, atrape esos
// comentarios en este arreglo
const mensajes = [
  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }
]

// Get mensajes (Aqui tenemos que retornar el arreglo de arriba)
router.get('/', function (req, res) {
  //res.json('Obteniendo mensajes');
  res.json( mensajes );
});

// Para hacer una peticion POST
router.post('/', function (req, res) {

  // Aqui usamos el Body Parser que instalamos
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  }

  // Agregamos al arreglo de mesnajes el nuevo mensaje
  mensaje.push( mensaje );

  res.json({
    ok: true,
    mensaje
  });
});

module.exports = router;