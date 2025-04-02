
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

    // Esto es por si queremos que el nuevo SW tome el control inmediatamente despues que se instala
    // y que no se espera a que el cliente cierre todo el navegador o precionar el SkipWaiting
    // Igual usar esto puede hacer que se pierda informacion que los clientes tienen o estan esperando
    self.skipWaiting();
});

// Este listener se ejecuta cuando el SW se activa
self.addEventListener('activate', event => {
    // Usualmente esto se usa para borrar cache viejo que es cuando el antiguo Sw murio y ya no queremos mantener sis caches
    // Este mensaje solo se muestra la primera vez, si volvemos a recargar el navegador no se tiene porque activar lo que ya esta activo
    console.log('SW activo y listo para controlar la aplicacion');
});