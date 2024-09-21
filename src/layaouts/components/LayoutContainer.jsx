import React from "react";
import Header from "../../components/Header";
import { Toaster } from "sonner";
import SideBar from "../../components/SideBar";

const LayoutContainer = ({ title, children }) => {
  return (
    <div className="w-full h-screen ">
      <Header title={title} />

      <SideBar />
      {children}

      <Toaster richColors position="top-center" />
    </div>
  );
};

export default LayoutContainer;
