(function() {

  'use strict';

  // Instalamos el SW para convertir nuestra aplicacion en SW
  if(navigator.serviceWorker){
    navigator.serviceWorker.register('/sw.js');
  }

  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById('new-todo');
  var syncDom = document.getElementById('sync-wrapper');

  // EDITING STARTS HERE (you dont need to edit anything above this line)

  // Creamos la base de dato y le damos el nombre entre comillas
  var db = new PouchDB('todos');
  var remoteCouch = false;

  // En Pouch podemos hacer que cuando la BD cambie (Como al inertar datos) ejectuar una accion inmediatamente
  // Cuando insertamos registros puede que lo hagan en varios lugares, con esta instruccion nos ahorramos eso
  db.changes({
    since: 'now',
    live: true,
  }).on('change', showTodos); // Cuando ocurra un cambio hara nuevamente el "showTodos"

  // We have to create a new todo document and enter it in the database
  function addTodo(text) {
    // Si el texto que recibe en la caja de texto esta vacio, que no haga nada para que no agrege campos vacios
    if( text.length <= 0 ) return;

    // Esto es para escribir en la BD
    // En PouchDB es obligatorio que los objetos tengan el "_id"
    var todo = {
      _id: new Date().toISOString(), // Crea el id con la fecha hasta los segundos
      title: text,
      completed: false
    }

    // Para agregar en la BD
    /*db.put(todo, function callback(err, result){
      if(!err){ // Si no viene un error
        console.log('Successfully posted a todo!');
      }
    });*/

    // Podemos usar Callback como arriba o podemos usar promesas
    // Aqui solo mandamos lo que queremos insetar
    db.put( todo )
    .then( console.log('insertado'))
    .catch(console.log('error'));
  }

  // Show the current list of todos by reading them from the database
  function showTodos() {
    // Mostramos todos los datos que esten en la BD en la interface
    // El "include_docs" es porque si solo queremos obtener cuanto registros hay en la BD
    /*db.allDocs({include_docs: true, descending: true}, function(err, doc){
      redrawTodosUI(doc.rows); // Esto muestra registro en la interface
    });*/

    // Este codigo es equivalente al de arriba pero usando promesas
    db.allDocs({include_docs: true, descending: true})
      .then(doc => {
        redrawTodosUI(doc.rows)
      })    
  }

  function checkboxChanged(todo, event) {
    // Actualizar un registro en la BD
    todo.completed = event.target.checked;
    db.put(todo).then(console.log('Registro Actualizado'));
  }

  // User pressed the delete button for a todo, delete it
  function deleteButtonPressed(todo) {
    // Eliminar
    db.remove(todo);
  }

  // The input box when editing a todo has blurred, we should save
  // the new title or delete the todo if the title is empty
  function todoBlurred(todo, event) {
    // Esta funcion es por si se hace algun cambio en el Todo
    var trimmedText = event.target.value.trim(); // Verifica que haya informacion dentro del campo de texto
    if( !trimmedText ){
      db.remove(todo); // Si no hay cambio borra
    }else{
      // Actualiza el titulo y hace el Put
      todo.title = trimmedText;
      db.put(todo);
    }
  }

  // Initialise a sync with the remote server
  function sync() {
  }

  // EDITING STARTS HERE (you dont need to edit anything below this line)

  // There was some form or error syncing
  function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
  }

  // User has double clicked a todo, display an input so they can edit the title
  function todoDblClicked(todo) {
    var div = document.getElementById('li_' + todo._id);
    var inputEditTodo = document.getElementById('input_' + todo._id);
    div.className = 'editing';
    inputEditTodo.focus();
  }

  // If they press enter while editing an entry, blur it to trigger save
  // (or delete)
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById('input_' + todo._id);
      inputEditTodo.blur();
    }
  }

  // Given an object representing a todo, this will create a list item
  // to display it.
  function createTodoListItem(todo) {
    var checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', checkboxChanged.bind(this, todo));

    var label = document.createElement('label');
    label.appendChild( document.createTextNode(todo.title));
    label.addEventListener('dblclick', todoDblClicked.bind(this, todo));

    var deleteLink = document.createElement('button');
    deleteLink.className = 'destroy';
    deleteLink.addEventListener( 'click', deleteButtonPressed.bind(this, todo));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'view';
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement('input');
    inputEditTodo.id = 'input_' + todo._id;
    inputEditTodo.className = 'edit';
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo));
    inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo));

    var li = document.createElement('li');
    li.id = 'li_' + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    if (todo.completed) {
      li.className += 'complete';
      checkbox.checked = true;
    }

    return li;
  }

  function redrawTodosUI(todos) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    todos.forEach(function(todo) {
      ul.appendChild(createTodoListItem(todo.doc));
    });
  }

  function newTodoKeyPressHandler( event ) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(newTodoDom.value);
      newTodoDom.value = '';
    }
  }

  function addEventListeners() {
    newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
  }

  addEventListeners();
  showTodos();

  if (remoteCouch) {
    sync();
  }

})();
