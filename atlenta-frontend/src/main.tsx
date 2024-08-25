import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound/index.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./utils/theme/index.ts";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
]);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
