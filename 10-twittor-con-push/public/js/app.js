
var url = window.location.href;
var swLocation = '/twittor/sw.js';
var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    /*
        Una buena practica es registrar el Service Worker hasta que el navegador web carga en su totalidad todo lo que es de la aplicacion
        porque el SW hace instalaciones y otras cosas del Fetch porlo que podriamos hacer que nuestra aplicacion sea un poco lenta
        Entonces hagamos el registro cuando nuestra pagina Web ya este cargada  
    */
   window.addEventListener('load', function() {
        // Lo colocamos aqui porque cuando el SW maneje la subscripcion reuerimos hacer algo en la pagina web y cuando por ejemplo toquemos el boton
        // de actitvar las notificaciones requerimos trabajar con el mismo registro del SW, para eso creamos la constante arriba
        navigator.serviceWorker.register( swLocation ).then( function(reg){
            swReg = reg;
            // Ahora queremos confirmar si ya estamos subscritos a las notificaciones o no
            // Si este objeto nos regresa cualquier cosa diferente de undefined quiere decir que podemos llamar la funcion que verifica la subscripcion
            // Sin los parentesis porque queremos que ejecute la subscripcion inmediatamente
            swReg.pushManager.getSubscription().then( verificarSuscripcion );
        });
   });
}

// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivadas    = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    var data = {
        mensaje: mensaje,
        user: usuario
    };


    fetch('api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    })
    .then( res => res.json() )
    .then( res => console.log( 'app.js', res ))
    .catch( err => console.log( 'app.js error:', err ));



    crearMensajeHTML( mensaje, usuario );

});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('api')
        .then( res => res.json() )
        .then( posts => {

            console.log(posts);
            posts.forEach( post =>
                crearMensajeHTML( post.mensaje, post.user ));


        });


}

getMensajes();



// Detectar cambios de conexión
function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else{
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();

// Notificaciones

// Funcion para activar o desactivar los botones que tenemos en la pantalla de inicio 
// Queremos recibir por argumento si estan activadas las notificaciones
function verificarSuscripcion( activadas ){
    if( activadas ){
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');
    }else{
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }
}

// Llamamos la funcio para que por defecto nos salga el boton de notificaciones desactivadas porque es el que vamos a programar
// Al comentarla hacemos que solo se llame esta funcion al inicio (Que es cuando el SW es registrado)
//verificarSuscripcion();

function enviarNotificaciones(){
    const notificationOptions = {
        body: 'Este es el cuerpo de la notificacion',
        icon: 'img/icons/icon-72x72.png'
    };

    // Si queremos ejecutar codigo cuando esta notificacion se seleccion podemos almacenarla en una consola
    // Esto es solo una demostracion porque esto se hace del lado del SW
    const n = new Notification('Hola Mundo', notificationOptions);

    n.click = () => {
        console.log('Click');
    }
}

// Funcion para pedirle el acceso a los usuario de las notificaciones
function notificarme(){
    // Primero verificamos si el navegador web soporta las notificaciones
    if( !window.Notification ){
        console.log('Este Navegador no soporta notificaciones');
        return;
    }   
    
    // En este punto si lo soporta
    // Aqui queremos hacer una confirmacion, en caso que ya se le ah otorgado previmente
    // (Si ya anteriormente le preguntamos al usuario si desea recibir notificaciones)
    if( Notification.permission === 'granted' ){
        //new Notification('Hola Mundo! - Granted');
        enviarNotificaciones();
    // Si no se ah negado o esta en su estado por defecto entonces hay que solicitar al usuario que las active
    }else if( Notification.permission !== 'denied' || Notification.permission === 'default' ){
        Notification.requestPermission( function( permission ){
            // Aqui adentro podemos ver cual es la opcion del usuario que nos selecciono
            console.log(permission);
            // En este caso acepto notificaciones
            if( permission === 'granted' ){
                new Notification('Hola Mundo! - Pregunta');
            }
        });
    }
}

//notificarme();

// Ahora debemos de tomar la llave publica y prepararla desde el fronted para que creemos nuestra subscripcion
function getPublicKey() {
    // llamamos la API que nos regresa la llave
    /*fetch('api/key')
        .then( res => res.text ) // Obtenemos la respuesta
        .then( console.log )*/
    // Lo de arriba eta una prueba, lo que tenemos que hacer es lo siguiente
    return fetch('api/key')
        .then( res => res.arrayBuffer() )
        // Retornamos el arreglo pero como un Unit8array (Esto es lo que nesecita la subscripcion)
        .then( key => new Uint8Array(key) );
}

//getPublicKey().then( console.log );

// Queremos hacer todo el proceso de subscripcion cuando el usuario haga click en el boton Rojo de Notificaciones Desactivadas
// Aqui tenemos todo el proceso para generar la suscripcion y mandarla con el POST
btnDesactivadas.on( 'click', function(){
    // Verificamos primero si no existe el registro del SW entonces no podemos hacer nada
    if( !swReg ) return console.log('No hay registro del Service Worker');

    // Si todo esta Ok obtenemos la llave, esa llave es la que requerimos para crear el registro en el SW
    getPublicKey().then(function(key){
        
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( suscripcion => {
            //console.log(suscripcion); -> Aqui tenemos la subscripcion
            fetch('api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( suscripcion )
            })
            .then( verificarSuscripcion )
            .catch( console.log );
        });
    });

    // Al precionar el boton de color rojo veremos que cambia a color azul
    // En consola veremos toda la informacion para poder mandar notificaciones push
    // El proceso del pushManager tambien genera el prompt de si quiere recibir notificaciones
});