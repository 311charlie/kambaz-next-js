"use client";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";
export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex align-items-center">
      <Button onClick={() => dispatch(deleteTodo(todo.id))} className="btn btn-danger me-2" id="wd-delete-todo-click">Delete</Button>
      <Button onClick={() => dispatch(setTodo(todo))} className="btn btn-warning me-2" id="wd-set-todo-click">Edit</Button>
      {todo.title}
    </ListGroupItem>
  );
}
