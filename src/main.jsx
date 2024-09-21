import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./layaouts/AuthPage/AuthPage.jsx";
import DiagramPage from "./layaouts/DiagramPage/DiagramPage.jsx";
import TypeCodePage from "./layaouts/TypeCodePage/MainPage.jsx";
import WorkshopPage from './layaouts/WorkShopPage/WorkshopPage';
import DetailFolder from "./layaouts/WorkShopPage/Detail/DetailFolder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TypeCodePage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path:"/wiring-diagram",
    element: <DiagramPage  />,
  },
  {
    path:"/workshop",
    element: <WorkshopPage />,
  },
  {
    path:"/detail/:name/:id",
    element: <DetailFolder />,
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
