import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import Dexie from "dexie";
import { For } from "solid-js";

interface Todo {
  id?: number;
  label: string;
}

class TodoDatabase extends Dexie {
  todos!: Dexie.Table<Todo, number>;

  constructor() {
    super("TodoDatabase");
    this.version(1).stores({
      todos: "++id,label",
    });
  }
}

function Todos() {
  const queryClient = useQueryClient();

  const db = new TodoDatabase();
  db.version(1).stores({
    todos: "++id,label",
  });

  const getTodosQuery = createQuery(() => ({
    queryKey: ["todos.get"],
    queryFn: () => db.todos.toArray(),
  }));

  let form: HTMLFormElement;

  const createTodoMutation = createMutation<unknown, unknown, Todo>(() => ({
    mutationKey: ["todos.create"],
    mutationFn: (todo) => db.todos.add(todo),
    onMutate: () => form.reset(),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["todos.get"] }),
  }));

  const deleteTodoMutation = createMutation<unknown, unknown, number>(() => ({
    mutationKey: ["todos.delete"],
    mutationFn: (id) => db.todos.delete(id),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["todos.get"] }),
  }));

  return (
    <>
      <div class="flex grow flex-col overflow-y-scroll">
        <For each={getTodosQuery.data}>
          {(todo) => (
            <div class="flex space-x-0.5">
              <input
                type="checkbox"
                id={todo.id!.toString()}
                name={todo.id!.toString()}
                onClick={() => deleteTodoMutation.mutate(todo.id!)}
              />
              <label for={todo.id!.toString()}>{todo.label}</label>
            </div>
          )}
        </For>
      </div>

      <div class="flex shrink-0 basis-[68px]">
        <form
          ref={form!}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            createTodoMutation.mutate({ label: data.get("label")! as string });
          }}
          style={{ width: "100%" }}
        >
          <input
            class="unset h-full w-full cursor-text"
            autofocus
            required
            type="text"
            id="label"
            name="label"
            placeholder="What do you need to do?"
          />
        </form>
      </div>
    </>
  );
}

export default Todos;
