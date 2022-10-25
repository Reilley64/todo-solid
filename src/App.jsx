import "sanitize.css";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import Todos from "./Todos";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

export default App;
