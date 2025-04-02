

// Detectar si podemos usar Service Workers
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

// Peticion a un endpoint (Solo lo llamamos no nos interesa lo que se haga con el )
fetch('https://reqres.in/api/users')
.then( resp => resp.text() )
.then( console.log );