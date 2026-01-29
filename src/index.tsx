import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./features/screens/Home";
import { Register } from "./features/auth/Register";
import { Login } from "./features/auth/Login";
import { Protected } from "./features/screens/Protected";
import { AGSAppBar } from "./features/ui/AGSAppBar";
import { AuthProvider } from "./features/context/AuthContext";
import { Watchlist } from "./features/screens/Watchlist";
import { TMDBConfigProvider } from "./features/context/TMDBConfigContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./features/ui/theme";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { isAxiosError } from "axios";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error))
    return (
      error.response?.data.message ||
      error.message ||
      "An unknown network error occured."
    );
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again";
};

// TODO: Move rating and review queries/mutations to the tanstack setup

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  }),
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TMDBConfigProvider>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Toaster position="bottom-left" />
            <BrowserRouter>
              <Routes>
                <Route element={<AGSAppBar />}>
                  <Route index element={<Home />} />
                  <Route path="register" element={<Register />} />
                  <Route path="login" element={<Login />} />
                  <Route path="protected" element={<Protected />} />
                  <Route path="watchlist" element={<Watchlist />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </TMDBConfigProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
