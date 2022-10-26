import "sanitize.css";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ErrorBoundary, Suspense } from "solid-js";

import Todos from "./Todos";

const queryClient = new QueryClient({ defaultOptions: { queries: { suspense: true }}});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ "font-family": "Arial", width: "100%", "margin-inline": "auto", "max-width": "60ch", "padding-inline-start": "16px", "padding-inline-end": "16px", "padding-top": "12px", "padding-bottom": "12px", display: "flex", "flex-direction": "column", "min-height": "100vh" }}>
        <div style={{ "align-items": "center", display: "flex", "flex-basis": "68px" }}>
          <div>
            <span style={{ "font-weight": "bold", "font-size": "32px" }}>TODO</span>
            <span style={{ "margin-left": "8px", opacity: 0.7 }}>reilley.dev</span>
          </div>
        </div>
        <Suspense fallback="Loading...">
          <ErrorBoundary fallback={err => err}>
            <Todos />
          </ErrorBoundary>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
