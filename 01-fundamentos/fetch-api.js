// Creamos la peticion y con esta funcion tenemos una promesa
fetch('https://reqres.in/api/users')
// Aqui tenemos la respues
.then( resp => {
    // De la respuesta veremos que en el Body tenemos algo que se llama ReadableStream, ahi es donde estan los datos
    // ya que las respuestas no siempre van a ser JSON, segun el tipo le tenemos que dar un tratamiento u otro
    //  console.log(resp);

    // Asi convertimos a JSON y tambien es una promesa
    // resp.json().then( console.log );
    // al ser una promesa podemos usar la concatenacion de promesas como abajo
    resp.json()
})
.then( respObj => console.log );

// Esto No Lo Debemos De Hacer
// Asi es como podemos extraer todo el contenido de una pagina web
// Para que funcione sebemos tener instalada la extencion para desactivar el Access control Expose Headers
fetch('https://www.wikipedia.org')
.then( resp => resp.text() )
.then( html => {
    console.log(html)
});
