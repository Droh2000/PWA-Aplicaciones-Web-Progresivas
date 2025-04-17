class Camara {

    constructor( videoNode ) {
        // Aqui hacemos referencia al contenedor que tenemos en el "index.html" donde esta
        // la etiqueta de Video donde requerimos usar la referencia por su ID y eso es lo
        // que mandamos al constructor
        this.videoNode = videoNode
    }

    encender(){
        // Con esto encendemos la camara, dentro le pasamos un objeto con la configuracion que nos interesa
        navigator.mediaDevices.getUserMedia({
            audio: false, // No nos interesa capturar el audio
            // Elegimos aqui una resolucion pequena porque sino por defecto toma la maxima calidad posible            
            video: { width: 300, height: 300 }
        }).then( stream => {
            // Esto nos regresa el Stream de datos que queremos mostrar (Con esto es como lo podemos renderizar en la pagina)
            this.videoNode.srcObject = stream;
            // Como mas adelante queremos detener este Stream de datos, nos creamos esta propiedad
            this.stream = stream;
        });
    }

    apagar(){
        // Pausamos el Video
        this.videoNode.pause();
        // Esto es para detener el Stream (Obtenemos el de la posicion 0 que es el video)
        // Si lo detenemos y todabia no lo tenemos definido esto nos dara error por eso comprobamos con la validacion
        if( this.stream ){
            this.stream.getTracks()[0].stop();
        }
    }

    // Obtenemos del Stream la imagen y lo pasamos por un canvas (Lienzo donde podemos colocar informacion)
    tomarFoto(){
        // Aqui vamos a renderizar la foto
        let canvas = document.createElement('canvas');

        // Colocar las dimenciones igual al elemento del Video
        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);

        // Obtener el contexto del canvas
        let context = canvas.getContext('2d');// una simple imagen

        // dibujamos la imagen dentro del canvas
        context.drawImage( this.videoNode, 0, 0, canvas.width, canvas.height );

        // Extreamos la imagen (Esto nos da un string en base 64)
        this.foto = context.canvas.toDataURL();

        // Limpieza geenral
        canvas = null;
        context = null;

        return this.foto;
    }
}