import { useState, useEffect, useReducer, useRef } from "react";

import classes from "./App.module.css";

function App() {
  
  const initState = {
    editing: false,
    editItem: {},
    todos: [],
  };

  const todoReducer = (state = initState, action) => {
    switch (action.type) {
      case "LoadTodos":
        return {
          ...state,
          todos: action.data,
        };
      case "AddTodo":
        return {
          ...state,
          todos: state.todos.concat(action.data),
        };
      case "UpdateTodo":
        return {
          ...state,
          todos: state.todos.map((todo) =>
            todo.id === action.id ? action.data : todo
          ),
          editing: false,
          editItem: {},
        };
      case "DeleteTodo":
        return {
          ...state,
          todos: action.todos,
        };
      case "SetEditing":
        return {
          ...state,
          editing: true,
          editItem: { ...action.editItem },
        };
      case "StopEditing":
        return {
          ...state,
          editing: false,
          editItem: {}
        };
      default:
        return state;
    }
  };

  const [todo, setTodo] = useState("");

  const [data, dispatch] = useReducer(todoReducer, initState);

  useEffect(() => {
    const getTodosFromLocalStorage = console.log(localStorage.getItem("todos"));
    if (getTodosFromLocalStorage) {
      dispatch({type: "LoadTodos", data: JSON.parse(getTodosFromLocalStorage)});
    } else {
      dispatch({ type: "LoadTodos", data: [] });
    }
  }, []);

  useEffect(() => {
    console.log(localStorage.setItem("todos", JSON.stringify(data.todos)));
  }, [data.todos]);

  const handleAddTodoForm = (event) => {
    event.preventDefault();
    if (todo !== "") {
      dispatch({type: "AddTodo", data: { id: data.todos.length + 1, text: todo.trim() }});
    }
    setTodo("");
  };

  const handleEditTodoForm = (event) => {
    event.preventDefault();
    dispatch({type: "UpdateTodo", id: data.editItem.id, data: { ...data.editItem, text: todo }});
    setTodo("");
  };

  const handleEditClick = (id) => {
    const item = data.todos.find((todo) => todo.id === id);
    setTodo(item.text);
    dispatch({ type: "SetEditing", editItem: item });
    console.log(data);
  };

  const handleCancelEdit = () => {
    dispatch({ type: "StopEditing" });
    setTodo("");
  };

  const handleDelete = (id) => {
    const newTodos = [...data.todos];
    newTodos.splice(id, 1);
    dispatch({ type: "DeleteTodo", todos: newTodos });
    setTodo("");
  };

  const handleInputChange = (event) => {
    setTodo(event.target.value);
    console.log(todo);
  };

  return (
    <div className={classes.App}>
      <h1>React Todos </h1>
      <form onSubmit={data.editing ? handleEditTodoForm : handleAddTodoForm} className={classes.TodoForm} >
        <input type="text" name="todos" value={todo} onChange={handleInputChange} />
        <button type="submit">{data.editing ? "Update Todo" : "Add Todo"}</button>
        {data.editing ? (<button onClick={handleCancelEdit}> Cancel </button>) : ( "")}
      </form>
      <div>
        <ul className={classes.TodoList}>
          {data.todos.length > 0 ? (
            data.todos.map((item, index) => {
              return (
                <li key={item.id}>
                  {item.text}
                  <button onClick={() => handleEditClick(item.id)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </li>
              );
            })
          ) : (
            <h4> No Todos Found, Add Todos </h4>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
