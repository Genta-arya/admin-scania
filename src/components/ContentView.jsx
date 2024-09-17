import React from "react";
import { useLocation } from "react-router-dom";
import MainPage from "../layaouts/TypeCodePage/MainPage";
import AuthPage from "../layaouts/AuthPage/AuthPage";
import DiagramPage from "../layaouts/DiagramPage/DiagramPage";
import SideBar from "./SideBar";

const ContentView = () => {
  const paths = [
    { path: "/", component: <MainPage /> },
    { path: "/wiring-diagram", component: <DiagramPage /> },
    { path: "/auth", component: <AuthPage /> },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  const matchedRoute = paths.find((item) => item.path === currentPath);

  return (
    <main className="h-screen ">
      <div className="flex h-full">
        <SideBar />

        <div className="">
          {matchedRoute ? matchedRoute.component : <div>404 Not Found</div>}
        </div>
      </div>
    </main>
  );
};

export default ContentView;
