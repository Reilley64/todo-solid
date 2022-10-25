import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import cuid from "cuid";
import { For, Match, Switch } from "solid-js";

function Todos() {
  const queryClient = useQueryClient();

  let form;

  const getTodosQuery = createQuery(
    () => ["todos.get"],
    async () => {
      try {
        const item = window.localStorage.getItem("todos");
        if (item) return JSON.parse(item);
        window.localStorage.setItem("todos", JSON.stringify([]));
        return [];
      } catch (error) {
        window.localStorage.setItem("todos", JSON.stringify([]));
        return [];
      }
    },
  );

  const createTodoMutation = createMutation(
    ["todos.create"],
    async (todo) => {
      todo.id = cuid();
      const item = window.localStorage.getItem("todos");
      const json = JSON.parse(item);
      json.push(todo);
      window.localStorage.setItem("todos", JSON.stringify(json));
      return todo;
    },
    {
      onMutate() {
        form.reset();
      },
      onSuccess() {
        queryClient.refetchQueries(["todos.get"]);
      },
    }
  );

  const deleteMutationQuery = createMutation(
    ["todos.delete"],
    async (id) => {
      const item = window.localStorage.getItem("todos");
      const json = JSON.parse(item);
      json.splice(json.findIndex((todo) => todo.id === id), 1);
      window.localStorage.setItem("todos", JSON.stringify(json));
      return json;
    },
    {
      onSuccess() {
        queryClient.refetchQueries(["todos.get"]);
      }
    }
  );

  return (
    <div style={{ width: "100%", "margin-inline": "auto", "max-width": "60ch", "padding-inline-start": "16px", "padding-inline-end": "16px" }}>
      <Switch>
        <Match when={getTodosQuery.isLoading}>Loading...</Match>
        <Match when={getTodosQuery.isError}>Error</Match>
        <Match when={getTodosQuery.isSuccess}>
          <div style={{ display: "flex", "flex-direction": "column", "min-height": "100vh", "padding-top": "12px", "padding-bottom": "12px" }}>
            <div style={{ display: "flex", "flex-direction": "column", "flex-grow": 1, "overflow-y": "scroll" }}>
              <For each={getTodosQuery.data}>
                {(todo) => (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="checkbox" id={todo.id} name={todo.id} onClick={() => deleteMutationQuery.mutate(todo.id)} />
                    <label for={todo.id}>{todo.label}</label>
                  </div>
                )}
              </For>
            </div>
            <div style={{ display: "flex", "flex-basis": "68px", "flex-shrink": 0 }}>
              <form
                ref={form}
                onSubmit={(e) => {
                  e.preventDefault();
                  createTodoMutation.mutate({ label: e.target.label.value });
                }}
                style={{ width: "100%" }}
              >
                <input
                  autofocus
                  required
                  type="text"
                  id="label"
                  name="label"
                  placeholder="What do you need to do?"
                  style={{ all: "unset", height: "100%", width: "100%", cursor: "revert" }}
                />
              </form>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export default Todos;
