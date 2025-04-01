const sumarLento = ( numero ) => {
    return new Promise( ( resolve, reject ) => {
        setTimeout(() => {
            resolve( numero + 1 );
        }, 800); 
    });
}

const sumarRapido = ( numero ) => {
    return new Promise( ( resolve, reject ) => {
        setTimeout(() => resolve( numero + 1 ), 300); 
    });
}

// El Promise Race pone a competir todos los paremtros ingresados al arreglo
// y nos da una unica repuesta pero va a ser de la promesa que responda primero
// y si ambas o mas responden igual, entonces nos dara la que se encuentre mas del lado izquierdo
Promise.race( [ sumarLento(5), sumarRapido(10) ] )
.then( respuesta => {
    console.log(respuesta);
})
// Si una de las promesas termina con error y la otra si termine correctamente, Si es la promesa 
// que termina con error entonces se cancela todo el proceso pero si la que se termina primero sale OK
// y despues seria la del error, entonces si nos muestra el resultado de esa promesa que termino bien por ser la primera
.catch( console.log );

// Esta promesa nos sirve para determinar si es mas rapido de leer de internet o el almacenamiento local