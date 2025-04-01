
// Suponemos que tenemos esta informacion del usuario
const usuario = {
    nombre: 'Fernando',
    edad: 32,
};

fetch('https://reqres.in/api/users', {
    // Aqui definimos las propiedades
    method: 'POST', // PUT
    // Esto es lo que queremos mandar que debe ser un JSON en forma de string
    body: JSON.stringify( usuario ),
    // Aqui especificamos los tipos de datos
    headers: {
        'Content-Type': 'application/json'
    }
})
.then( resp => resp.json() )
.then( console.log ) // Aqui ya tenemos la respuesta del dato que se mando 
.catch( console.error );
