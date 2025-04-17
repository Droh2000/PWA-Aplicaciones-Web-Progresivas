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

    }
}