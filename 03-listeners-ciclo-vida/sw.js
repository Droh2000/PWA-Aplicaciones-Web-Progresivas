
/*
    Cuando es la primera vez que nuestra pagina web carga, ahi es cuando trae
    el archivo del SW que registra con el comando ".register" que esta en el archivo
    de JS, si no existe ningun SW anterior, se descarga, se instala y luego se activa

    Durante el proceso de la instalacion podemos hacer cosas
    Este Listener se va a disparar cada vez que ocurra un cambio menor en el SW
*/
self.addEventListener('install', event => {
    // En este proceso normalmente se realiza la descarga de archivos externos como CSS, JS
    // Tambien aqui se crea el Cache, si mostramos este mensaje, veremos que se visualiza 
    // lo luego al recargar el navegar sin antes preciona el SkipWaitting porque al ser un Nuevo SW 
    // Empieza esta fase de Instalacion (Si volvemos a recargar el navegador ya no sale el mensaje 
    // ya que el navegador sabe que es el mismo SW que antes)
    console.log('Instalando el Service Worker');
});