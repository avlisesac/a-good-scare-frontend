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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TMDBConfigProvider>
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
      </TMDBConfigProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
