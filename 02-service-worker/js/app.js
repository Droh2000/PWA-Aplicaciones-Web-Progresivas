// Primero debemos revisar si el navegador de usuario puede usar el Service Worker
// if( 'serviceWorker' in navigator ){
if( navigator.serviceWorker ){
    //  console.log('Podemos Usar El SW');

    // Registramos el SW el cual le pasamos el archivo donde lo implementaremos
    // Este archivo normalmente se coloca en la Raiz de la aplicacion web, al mismo nivel del index o archivo que arranca nuestra app
    // Por aqui en la carpeta donde se meta el SW es la carpeta que controlara el SW, asi si esta en la carpeta principal podra el SW controlar todo el proyecto
    navigator.serviceWorker.register('./sw.js');
}