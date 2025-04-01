// Si queremos obtener el contenido de un archivo HTML
fetch('notFound.html')
// La respuesta siempre la tenemos que convertir en lo que necesitamos
.then( resp => resp.text() )
.then( html => {
    // Hacemos referencia al body
    const body = document.querySelector('body');
    body.innerHTML = html;
    // Podemos obtener un error, si no existe el archivo pero esto nos dara un 404 que no lo atrapa el Catch
    // Si tenemos un error de sintaxis eso si lo captura el catch
})
.catch(err => {
    console.log(err);
});