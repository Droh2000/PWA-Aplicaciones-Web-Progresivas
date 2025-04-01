// Si hacemos un GEt a un URL que no es valida obtendremos el error del catch
// pero si mandamos un ID muy grande nos da 404, este error no es manejado por el Catch
fetch('https://reqres.in/api/users/10000') 
.then( resp => {

    // Cualquier status 400 nos dara el mismo problema, viendo el objeto de la respuesta requerimos verificar
    // si la peticion se hace correctamente mediante la propiedad "ok"
    console.log(resp);

    if( resp.ok ){
        /*resp.json().then( user => {
            console.log(user.data);
        });*/
        // Para mejor mostrarlo en el then
        return resp.json();
    }else{
        console.log('No existe el usuario');
        // Para capturar el error 400
        throw new Error('No existe el usuario');
    }
})
.then( console.log )
.catch( err => {
    console.log('Error en la aplicacion');
    console.log(err);
});
