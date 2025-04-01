
// Esta funcion nos retornara un promesa
function sumarUno( numero ){

    // Las promesas reciben internamente dos callbacks, una que se ejecuta cuando todo sale Ok y otra cuando Falla
    const promesas = new Promise( ( resolve, reject ) => {
        setTimeout( () => {

            // Ahora ya no requerimos especificar un Callback como argumento, ya con la promesa tenemos la funcion
            // para cuando obtenemos un valor en una resolucion correcta
            resolve( numero + 1);
        }, 800 );
    })

    return promesa;
}

// Con el Then (Como esta funcion regresa una promesa podemos acceder a sus propiedades)
// obtenemos el valor de resolverse correctamente la promesa (Cuando ya se resuelve dispara el then)
sumarUno( 5 ).then((result) => {// El argumento "result" es el valor obtenido del "resolve"
    console.log(result);// Se muestra el valor de la suma

    // Si queremos volver a ejecutar la funcion con este valor del "result"
    // Se ve un poco mas simple esto pero seguimos teniendo ese problema de anidacion
    /*sumarUno( 5 ).then( result2 => {
        console.log(result2);
    });*/
    // Para resolverlo, las promesas pueden retornar otras promesas
    return sumarUno( result );
})
// El nuevo valor obtenido de retornar otra promesa, lo podemos obtener asi
.then( result => {
    console.log(result);
    // Podemos seguir haciendo encadenamientos 
    return sumarUno( result );// Si no retornamos el valor sale Undefined (Para hacer encadenamientos la priomesa debe regresar otra promesa)
})
.then( result => {
    console.log(result);
})
.catch((err) => {
    console.log(`Todo se Jodio en ${err}`);
});;