import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./layaouts/AuthPage/AuthPage.jsx";
import DiagramPage from "./layaouts/DiagramPage/DiagramPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path:"/wiring-diagram",
    element: <App />,
  },
  {
    path:"/workshop",
    element: <App />,
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
