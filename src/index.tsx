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
import { TestScreen } from "./features/screens/TestScreen";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AGSAppBar />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="test" element={<TestScreen />} />
            <Route path="protected" element={<Protected />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
