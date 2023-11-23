import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ErrorBoundary, Suspense } from "solid-js";

import Todos from "./Todos";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div class="mx-auto flex min-h-screen w-full max-w-[60ch] flex-col px-2 py-1.5 font-sans">
        <div class="flex basis-[68px]">
          <div>
            <span class="text-[2rem] font-bold">TODO</span>
            <span class="ml-0.5 opacity-70">reilley.dev</span>
          </div>
        </div>

        <Suspense fallback="Loading...">
          <ErrorBoundary fallback={(err) => err}>
            <Todos />
          </ErrorBoundary>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
