
// Suponemos que tenemos esta funcion asyncrona que demora cierta cantidad de segundos en resolverse
function sumarUno( numero, callBack ){

    // Tenemos que verificar los valores con validaciones
    if( numero >= 7 ){
        // Aqui tenemos el primer inconveniente, porque no sabemos cuando el Callback resuelve un error o resuelve correctamente el valor
        // La solucion seria que si hay un error en el callback, el primer argumento es el error, si no sucede ningun error entonces los argumentos despues del primero
        // Son la respuesta que esperamos (Entonces cuando se recuelve correctamente tenemos que mandar un Null cuando no exista error)
        callBack('Numero muy alto');
        return;
    }

    setTimeout( function() {
        // Al ejecutar este archivo veremos que nos sale UNDEFINED y despues del tiempo en milisemimas podemos seguir escribiendo en consola
        // Esto del undefined es porque este return  hace referencia al de esta funcion interna y el undefined viene que la funcion principal al
        // no tener nada por defecto nos regresa eso 
        //  return numero + 1;
        callBack(null, numero + 1);
    }, 800 );
}

// console.log( sumarUno(5) );

// Para que nos salga el valor del return, le pasamos un callback para que la ejecute cuando ya se termine el Time
// Asi es como nos sale el valor correcto despues de que se termino el TIME
sumarUno(5, function( error, nuevoValor ){ // En cada llamada del callback tenemos que especificar el argumento del error
    // console.log(nuevoValor);

    // Si el argumento del error tiene algo, entonces tenemos que cancelar la ejecucion del proceso
    if( error ){
        console.log(error);
        return;
    }

    // Ahora queremos con esta respuesta, volver a ejecutar ese mismo codigo
    // Este resultado sale despues del doble que dira el TIME
    sumarUno( nuevoValor, function( error, nuevoValor2 ){
        // console.log(nuevoValor2);

        if( error ){
            console.log(error);
            return;
        }

        // Si queremos volver a ejecutar la misma funcion dentro
        sumarUno( nuevoValor2, function( error, nuevoValor3 ){
            if( error ){
                console.log(error);
                return;
            }

            console.log(nuevoValor3);
        });
    });
});
// Este codigo es muy grande y muy problematico porque tenemos Callback anidados por eso es que Existen las PROMESAS