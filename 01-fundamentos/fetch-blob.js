// Aqui vamos a trabajar con una imagen, la vamos a leer como un Blog
// y la colocaremos como el SRc de una imagen

// Tomamos el elemento HTML donde queremos insertar la imagen
const imgHTML = document.querySelector('img');

fetch( 'img.jpg' ) // Podemos hacerlo a recursos y almacenarlos en el navegador para futuras lecturas
.then( resp => resp.blob() ) // Convertimos la respuesta a Imagen
.then( img => {
    // Con el objeto URL creamos URLs
    // Del objeto que le mandamos (En este caso la imagen) queremos que nos cree la url para mandarsela al HTML
    const imgPath = URL.createObjectURL( img );// Esto nos da una ruta hexadecimal que cambia en cada recarga de la pagina

    imgHTML.src = imgPath;
});