
function sumarUno( numero ){

    const promesas = new Promise( ( resolve, reject ) => {
        // Evaluacion para el manejo del error
        // Aqui usamos la funcion para cuando ocurren los errores
        if( numero >= 7 ){
            reject('El numero debe ser menor a 7');
        }

        setTimeout( () => {

            resolve( numero + 1);
        }, 800 );
    })

    return promesa;
}

// TIP: Para reducir el codigo al requerir que dentro cada Then tengamos que volver a llamar la misma funcion
// En esta parte reacomodamos el codigo (Como el argumento es el mismo al que se le manda la funcion, solo se especifica
// directamente el nombre de la funcion), Asi hace el return automaticamente y el argumento se manda tambien
sumarUno( 5 ).then( sumarUno )
.then( sumarUno )
.then( result => console.log(result) )
// La promesas que no se manejan con Catch al dar error, detienen toda la ejecucion
// Manejamos una excepcion en las promesas (A parte del Catch tambien podemos mandar el error como seguno argumento dentro del THEN)
.catch((err) => {
    console.log(`Todo se Jodio en ${err}`);
});// Podemos tener uno que controle todo o uno para cada promesa
// Ya las promesas que estan despues no continuan cuando alguna dio error antes