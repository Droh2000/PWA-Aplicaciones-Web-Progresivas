
var url = window.location.href;
var swLocation = '/twittor/sw.js';

var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }


    window.addEventListener('load', function() {

        navigator.serviceWorker.register( swLocation ).then( function(reg){

            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });

}





// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';

// Google Maps llaves alternativas - desarrollo
// AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM
// AIzaSyDzbQ_553v-n8QNs2aafN9QaZbByTyM7gQ
// AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8
// AIzaSyCroCERuudf2z02rCrVa6DTkeeneQuq8TA
// AIzaSyBkDYSVRVtQ6P2mf2Xrq0VBjps8GEcWsLU
// AIzaSyAu2rb0mobiznVJnJd6bVb5Bn2WsuXP2QI
// AIzaSyAZ7zantyAHnuNFtheMlJY1VvkRBEjvw9Y
// AIzaSyDSPDpkFznGgzzBSsYvTq_sj0T0QCHRgwM
// AIzaSyD4YFaT5DvwhhhqMpDP2pBInoG8BTzA9JY
// AIzaSyAbPC1F9pWeD70Ny8PHcjguPffSLhT-YF8

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


var btnLocation      = $('#location-btn');

var modalMapa        = $('.modal-mapa');

var btnTomarFoto     = $('#tomar-foto-btn');
var btnPhoto         = $('#photo-btn');
var contenedorCamara = $('.camara-contenedor');

var lat  = null;
var lng  = null; 
var foto = null; 

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// Init de la camara Class (Le pasamos el elemento por su ID por Jquery, esto por defecto nos regresa un arreglo por eso elegimos la pos 0)
const camara = new Camara( $('#player')[0] );

// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje, lat, lng) {

    // console.log(mensaje, personaje, lat, lng);
    // Aqui les especificamos el "data-tipo" para saber si son de mensaje o Mapa
    var content =`
    <li class="animated fadeIn fast"
        data-user="${ personaje }"
        data-mensaje="${ mensaje }"
        data-tipo="mensaje">


        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
                `;
    // Si viene la foto inserta esto en el contenido HTML de mas arriba
    if ( foto ) {
        content += `
                <br>
                <img class="foto-mensaje" src="${ foto }">
        `;
    }
    // Para que esto funcione tenemos que al enviar el mensaje escribir un comentario
        
    content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;

    
    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if ( lat ) {
        crearMensajeMapa( lat, lng, personaje );
    }
    
    // Borramos la latitud y longitud por si las usó
    lat = null;
    lng = null;

    $('.modal-mapa').remove();// Removemos el espacio donde estaba el mapa para dar la imprecion que se reinicio todo

    timeline.prepend(content);
    cancelarBtn.click();

}

function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${ personaje }"
        data-lat="${ lat }"
        data-lng="${ lng }">
                <div class="avatar">
                    <img src="img/avatars/${ personaje }.jpg">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timeline.prepend(content);
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
             modalMapa.addClass('oculto');
             txtMensaje.val('');
         });
    }

});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val(); // Obtenemos la caja de texto
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }
    // Tenemos los datos que queremos enviar 
    var data = {
        mensaje: mensaje,
        user: usuario,
        lat: lat,
        lng: lng,
        foto: foto // Si no viene la foto tendra NULL y podemos verificar asi si viene o no
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

    crearMensajeHTML( mensaje, usuario, lat, lng, foto );
    
    foto = null; // Limpiamos la variable para no tener errores de memoria
});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('api')
        .then( res => res.json() )
        .then( posts => {

            // Si recargamos el navegador los mensajes deberian de obtener esa misma informacion porque los Post que estan 
            // almcenados en el servidor tambien tienen la informacion de la latitud y la longitud
            console.log(posts);

            posts.forEach( post => 
                crearMensajeHTML( post.mensaje, post.user, post.lat, post.lng, post.foto ));
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
function verificaSuscripcion( activadas ) {

    if ( activadas ) {
        
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');

    } else {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }

}



function enviarNotificacion() {

    const notificationOpts = {
        body: 'Este es el cuerpo de la notificación',
        icon: 'img/icons/icon-72x72.png'
    };


    const n = new Notification('Hola Mundo', notificationOpts);

    n.onclick = () => {
        console.log('Click');
    };

}


function notificarme() {

    if ( !window.Notification ) {
        console.log('Este navegador no soporta notificaciones');
        return;
    }

    if ( Notification.permission === 'granted' ) {
        
        // new Notification('Hola Mundo! - granted');
        enviarNotificacion();

    } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' )  {

        Notification.requestPermission( function( permission ) {

            console.log( permission );

            if ( permission === 'granted' ) {
                // new Notification('Hola Mundo! - pregunta');
                enviarNotificacion();
            }

        });

    }



}

// notificarme();


// Get Key
function getPublicKey() {

    // fetch('api/key')
    //     .then( res => res.text())
    //     .then( console.log );

    return fetch('api/key')
        .then( res => res.arrayBuffer())
        // returnar arreglo, pero como un Uint8array
        .then( key => new Uint8Array(key) );


}

// getPublicKey().then( console.log );
btnDesactivadas.on( 'click', function() {

    if ( !swReg ) return console.log('No hay registro de SW');

    getPublicKey().then( function( key ) {

        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( suscripcion => {

            // console.log(suscripcion);
            fetch('api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( suscripcion )
            })
            .then( verificaSuscripcion )
            .catch( cancelarSuscripcion );


        });


    });


});



function cancelarSuscripcion() {

    swReg.pushManager.getSubscription().then( subs => {

        subs.unsubscribe().then( () =>  verificaSuscripcion(false) );

    });


}

btnActivadas.on( 'click', function() {

    cancelarSuscripcion();


});


// Crear mapa en el modal
function mostrarMapaModal(lat, lng) {

    $('.modal-mapa').remove();
    
    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

    modal.append( content );
}


// Sección 11 - Recursos Nativos


// Obtener la geolocalización
// En los permisos del navegador tenemos para darle los permisos de acceder a la localizacion, al igual que con la camara
btnLocation.on('click', () => {

    //console.log('Botón geolocalización');
    $.mdtoast('Cargando Mapa...', {
        interaction: true,
        interactionTimeout: 2000,
        actionText: 'Ok!'
    });
    
    // En el momento que toquemos el boton el navegador nos pedira que le demos permiso a la geolocalizacion
    // Esto nos dara las coordenadas
    navigator.geolocation.getCurrentPosition( pos => {
        console.log(object)

        // Mostrar el mapa en el HTML
        mostrarMapaModal( pos.coords.latitude, pos.coords.longitude );

        // Queremos que cuando toquemos el lapiz vamos a mandar la coordenada obtenida de la ubicacion
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
    });
});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

    console.log('Inicializar camara');

    // Para mostrar el elemento HTML
    contenedorCamara.removeClass('oculto');

    // Centralizamos la logica de la camara en un archivo aparte
    camara.encender();
});


// Boton para tomar la foto
btnTomarFoto.on('click', () => {

    //console.log('Botón tomar foto');

    // Insertamos la foto en la variable que tenemos definida arriba
    foto = camara.tomarFoto();

    camara.apagar();
});


// Share API
// El Share API es una forma para compartir objetos, cosas, enlaces, imagenes y mandarlos a alguna parte
// lo que queremos hacer es que cuando toquemos una de las imagenes que subamos, nos abra una opcion para compartir
// dicho contenido en Redes sociales o en otras App
// Primero verificamos si nuestro navegador lo soporta
if( navigator.share ){
    // Al tocar una de las fotos de los heroes vamos a compartir sus mensajes, para esto usamos JQuery
    // Le queremos agregar este listener a los LI de HTML
    timeline.on('click', 'li', function(){
        // Extreamos la informacion que tenga ese perfil
        // Con esto obtenemos todo el elemento HTML al que le hicimos click
        //console.log($(this));

        // Extraigamos esas propiedades
        //console.log($(this).data('tipo'));
        //console.log($(this).data('user'));

        // Sacamos la informacion queq queremos compartir
        let tipo = $(this).data('tipo');
        let lat = $(this).data('lat');
        let lng = $(this).data('lng');
        let mensaje = $(this).data('mensaje');
        let user = $(this).data('user');

        // Como mas adelante podemos compartir el URL y si tenemos el mapa podemos mandar la direccion del Mapa
        // para que la persona haga click en el URL y lo redireccione al mapa
        const shareOpts = {
            title: user,
            text: mensaje
        };

        // Si es el mapa le agregamos un mensaje por defecto
        if( tipo === 'mapa' ){
            shareOpts.text = 'Mapa',
            // Despues del @ viene la latitud, la longitud y el Zoom
            shareOpts.url = `https://www.google.com/maps/@${ lat }, ${ lng }, 15`;
        }

        // Uso de Share API
        navigator.share(shareOpts)
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));

    });
}


