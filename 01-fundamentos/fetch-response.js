
// Hacemos una peticion a un usuario en particula
fetch('https://reqres.in/api/users/1')
.then( resp => {
    // Queremos trabajar con esta informacion dentro de la promesa
    // Si no Clonamos
    // Esto nos dara Error porque no podemos leer el body dos veses, como solucion
    // hay una manera de clonar una peticion, se recomienda clonarla la primera vez que la vamos a usar 
    resp.clone().json().then( user => {
        console.log(user.data);
    });
    // Pero a la vez requerimos diisparar otra peticion o trabajar con la Data de este lugar
    // Suponiendo que la respuesta la estamos utilizando para otra cosa
    resp.clone().json().then( user => {
        console.log(user.data);
    });
    // Si volvemos a copiar las lineas de arriba, nos saldra el mismo error asi que tenemos que volver a aplicar el clone antes
    resp.json().then( user => {
        console.log(user.data);
    });
}) // Convertimos los datos
/*.then( user => {
    console.log(user)
});*/
