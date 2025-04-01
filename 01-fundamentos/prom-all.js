// Cuando ocupamos ejecutar algun codigo despues de que un grupo de promesas terminen

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

// Requerimos trabajar con las dos funciones de forma simultanea
// El objeto Promise tienen una funcion Estatica, llamada All que recibe un arreglo de promesas
// El orden en el que pasemos las promesas no importa, ademas le podemos mandar otros valores 
// (Esto se usa para cuando requerimos agrupar una serie de tareas para que se ejcuten simultanieamente y despues ejecutar otra cosa)
Promise.all([ sumarLento(5), sumarRapido(10) ]) // Est se ejecuta como si fuera un promesa normal
// Las respuestas vienen en el mismo orden a como las promesas se pasaron
.then( respuestas => {
    console.log(respuestas);
})
.catch( console.log ); // Toma el argumento y muestra automaticamente el error
// Si alguna de las promesas que le pasemos Falla, todo falla no importa si algunas se resolvieron correctamente