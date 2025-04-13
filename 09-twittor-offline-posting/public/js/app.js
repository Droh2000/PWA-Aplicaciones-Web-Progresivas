
var url = window.location.href;
var swLocation = '/twittor/sw.js';


if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }


    navigator.serviceWorker.register( swLocation );
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

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicaciÃ³n
// Con esta funcion podemos renderizar los mensajes que recivamos del backend
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

    crearMensajeHTML( mensaje, usuario );

});

// Consumir los datos del Backend
function getMensajes(){
    //fetch('https://localhost:3000/api')
    // Como el backend esta corriendo en el mismo Hosting solo hay que poner asi
    fetch('api')
    // Convertimos la respuesta a JSON para extraer los datos que nos interesa
    .then(resp => resp.json())
    // Este es el Arreglo de los mensajes que tenemos almacenados
    .then( posts => {
        // Despues de esta implementacion ocurre que al agregar mensajes y recargar la pagina no salen los nuevos mensajes
        // sino hasta la segunda recarga de la pagina, esto es por la estrategia del cache que implementamos
        // si nos vamos a Application -> Cache Storage -> dynamicv1 (Aqui estamos haciendo un Backup de la peticion que hacemos`)
        // entonces la peticion GET la esta almacenando tanto aqui como en el StaticV1, entonces en el "sw.js" en la parte del Fetch
        // tenemos que implementar una condicion para cuando haga un llamado a la API no la almacene en el cache porque nos interesa que cuando
        // la aplicacion carge, nos traiga los ultimos mensajes, no nos traiga la ultimo que cargamos
        console.log(posts);

        // Para mostrar los mensajes en el Frontend
        posts.forEach(post => {
            crearMensajeHTML(post.mensaje, post.user);
        });
    });
}

// Como este es el archivo leido la primera vez, requerimos que se lea esta funcion lo luego
// para obtener los mensajes
getMensajes();