indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB

if (window.webkitIndexedDB)
  IDBTransaction = window.IDBTransaction = window.webkitIDBTransaction
  IDBKeyRange = window.IDBKeyRange = window.webkitIDBKeyRange
  indexedDB = window.webkitIndexedDB


class gtugruhr
  db: null
  onerror: (e)-> console.log e

  open: ()->
    gtug = @
    request = indexedDB.open "todos" 
    request.onsuccess = (e) ->
      v = "1.99"
      gtug.db = e.target.result
      if (v != gtug.db.version)
        setVrequest = gtug.db.setVersion v
        setVrequest.onerror = (e)-> gtug.onerror e
        setVrequest.onsuccess = ()->
          gtug.db.deleteObjectStore if (gtug.db.objectStoreNames.contains "todo")
          store = gtug.db.createObjectStore "todo",
            keyPath: "timeStamp"
          gtug.getAllTodoItems()
      else
        gtug.getAllTodoItems()

  dbAddTodo: (todoText)->
    gtug = @
    trans = @.db.transaction ["todo"], IDBTransaction.READ_WRITE
    store = trans.objectStore "todo"
    if todoText?
      data = 
        text: todoText
        timeStamp: new Date().getTime()
      request = store.put data
      request.onsuccess = ()-> gtug.getAllTodoItems()
      request.onerror = (e)-> console.log "Error Adding: #{e}"

  getAllTodoItems: ()->
    gtug = @
    todos = document.getElementById "todoItems"
    todos.innerHTML = ""
    trans = @.db.transaction ["todo"], IDBTransaction.READ_WRITE
    store = trans.objectStore "todo"
    #get evertything in the store
    keyRange = IDBKeyRange.lowerBound 0
    cursorRequest = store.openCursor keyRange
    cursorRequest.onsuccess = (e)->
      result = e.target.result
      if (!result)
        return false
      else
        gtug.renderTodo result.value
        result.continue()
    cursorRequest.onerror = (e) -> gtug.onerror e

  renderTodo: (row)->
    todos = document.getElementById "todoItems"
    li = document.createElement "li"
    t = document.createTextNode row.text
    li.appendChild t
    todos.appendChild li
    true 

  addTodo: ()->
    todo = document.getElementById "todo"
    @.dbAddTodo todo.value
    todo.value = ""

init = () ->
  gtug = new gtugruhr()
  gtug.open()
  document.getElementById("submit").addEventListener "click", ()->
    gtug.addTodo()
    false
  , false

window.addEventListener "DOMContentLoaded", init, false