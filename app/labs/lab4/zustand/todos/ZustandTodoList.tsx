"use client";
import { useTodoStore } from "./useTodoStore";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function ZustandTodoList() {
  const { todos, todo, addTodo, deleteTodo, updateTodo, setTodo } = useTodoStore((state) => state);
  return (
    <div id="wd-todo-list-zustand">
      <h2>Zustand Todo List</h2>
      <ListGroup>
        <ListGroupItem className="d-flex align-items-center">
          <Button onClick={addTodo} className="me-2">Add</Button>
          <Button onClick={updateTodo} className="me-2">Update</Button>
          <FormControl
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
        </ListGroupItem>
        {todos.map((t) => (
          <ListGroupItem key={t.id} className="d-flex align-items-center">
            <Button onClick={() => deleteTodo(t.id)} className="btn btn-danger me-2">Delete</Button>
            <Button onClick={() => setTodo(t)} className="btn btn-warning me-2">Edit</Button>
            {t.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
