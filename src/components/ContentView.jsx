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

  // Gunakan useLocation untuk mendapatkan path sekarang
  const location = useLocation();
  const currentPath = location.pathname;

  // Temukan komponen yang sesuai dengan path saat ini
  const matchedRoute = paths.find((item) => item.path === currentPath);

  console.log(currentPath);

  return (
    <main className=" ">
      <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full ml-28 md:ml-64 lg:w-64 ">
          <div className="p-4">
            {/* Render komponen yang sesuai dengan path */}
            {matchedRoute ? matchedRoute.component : <div>404 Not Found</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContentView;
