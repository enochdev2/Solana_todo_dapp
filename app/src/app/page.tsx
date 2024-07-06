import AddTodo from "@/components/AddTodo";
import Todo from "@/components/Todo";
import TodosCount from "@/components/TodosCount";

export default function Home() {
  return (
    <>
      <AddTodo />
      <Todo />
      <TodosCount />
    </>
  );
}
