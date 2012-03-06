var IDBKeyRange, IDBTransaction, gtugruhr, indexedDB, init;
indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
if (window.webkitIndexedDB) {
  IDBTransaction = window.IDBTransaction = window.webkitIDBTransaction;
  IDBKeyRange = window.IDBKeyRange = window.webkitIDBKeyRange;
  indexedDB = window.webkitIndexedDB;
}
gtugruhr = (function() {
  function gtugruhr() {}
  gtugruhr.prototype.db = null;
  gtugruhr.prototype.onerror = function(e) {
    return console.log(e);
  };
  gtugruhr.prototype.open = function() {
    var gtug, request;
    gtug = this;
    request = indexedDB.open("todos");
    return request.onsuccess = function(e) {
      var setVrequest, v;
      v = "1.99";
      gtug.db = e.target.result;
      if (v !== gtug.db.version) {
        setVrequest = gtug.db.setVersion(v);
        setVrequest.onerror = function(e) {
          return gtug.onerror(e);
        };
        return setVrequest.onsuccess = function() {
          var store;
          if (gtug.db.objectStoreNames.contains("todo")) {
            gtug.db.deleteObjectStore;
          }
          store = gtug.db.createObjectStore("todo", {
            keyPath: "timeStamp"
          });
          return gtug.getAllTodoItems();
        };
      } else {
        return gtug.getAllTodoItems();
      }
    };
  };
  gtugruhr.prototype.dbAddTodo = function(todoText) {
    var data, gtug, request, store, trans;
    gtug = this;
    trans = this.db.transaction(["todo"], IDBTransaction.READ_WRITE);
    store = trans.objectStore("todo");
    if (todoText != null) {
      data = {
        text: todoText,
        timeStamp: new Date().getTime()
      };
      request = store.put(data);
      request.onsuccess = function() {
        return gtug.getAllTodoItems();
      };
      return request.onerror = function(e) {
        return console.log("Error Adding: " + e);
      };
    }
  };
  gtugruhr.prototype.getAllTodoItems = function() {
    var cursorRequest, gtug, keyRange, store, todos, trans;
    gtug = this;
    todos = document.getElementById("todoItems");
    todos.innerHTML = "";
    trans = this.db.transaction(["todo"], IDBTransaction.READ_WRITE);
    store = trans.objectStore("todo");
    keyRange = IDBKeyRange.lowerBound(0);
    cursorRequest = store.openCursor(keyRange);
    cursorRequest.onsuccess = function(e) {
      var result;
      result = e.target.result;
      if (!result) {
        return false;
      } else {
        gtug.renderTodo(result.value);
        return result["continue"]();
      }
    };
    return cursorRequest.onerror = function(e) {
      return gtug.onerror(e);
    };
  };
  gtugruhr.prototype.renderTodo = function(row) {
    var li, t, todos;
    todos = document.getElementById("todoItems");
    li = document.createElement("li");
    t = document.createTextNode(row.text);
    li.appendChild(t);
    todos.appendChild(li);
    return true;
  };
  gtugruhr.prototype.addTodo = function() {
    var todo;
    todo = document.getElementById("todo");
    this.dbAddTodo(todo.value);
    return todo.value = "";
  };
  return gtugruhr;
})();
init = function() {
  var gtug;
  gtug = new gtugruhr();
  gtug.open();
  return document.getElementById("submit").addEventListener("click", function() {
    gtug.addTodo();
    return false;
  }, false);
};
window.addEventListener("DOMContentLoaded", init, false);