import React from "react";
import Header from "../../components/Header";
import { Toaster } from "sonner";
import SideBar from "../../components/SideBar";
import useCheckLogin from "../../service/Hooks/useCheckLogin";
import LoadingGlobal from "../../components/Loading";

const LayoutContainer = ({ title, children }) => {
  const { user} = useCheckLogin();

  
  return (
    <div className="w-full h-screen ">
      {user && (
        <>
          <Header title={title} />

          <SideBar />
          {children}
        </>
      )}

      <Toaster richColors position="top-center" />
    </div>
  );
};

export default LayoutContainer;
