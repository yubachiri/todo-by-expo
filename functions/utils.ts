import {Todo} from "../App";
import {db} from "./firebaseConfig";

export const fetchTodo = async (user, setTodos) => {
  if (!user) {
    return
  }

  const todos: Todo[] = []

  const todoSnapshot = await db
    .collection("todos")
    .doc(user.uid)
    .collection("todos")
    .where("done", "==", false)
    .get()

  todoSnapshot.forEach((doc) => {
    const {content, done} = doc.data()
    const todo = {
      id: doc.id,
      content: content || "contentが取得できませんでした",
      done: done || false
    }
    todos.push(todo)
  })

  setTodos(todos)
}
