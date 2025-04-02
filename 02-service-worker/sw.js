// Este es el archivo del Service Worker donde estara toda su logica

// Este mensaje solo sale la primera vez, una vez recargado el navegador ya no sale porque el SW ya se instalo
// Cuando el navegador interpreta la instruccion de "serviceWorker.register" en el archivo "app.js" ya detecta que es 
// el mismo SW y no lo instala
console.log('Activo el SW');