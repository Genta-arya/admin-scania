import React from "react";
import Header from "../../components/Header";
import { Toaster } from "sonner";
import FolderList from "./components/FolderList";

const WorkshopPage = () => {
  return (
    <div className="w-full ">
      <Header title={"Workshop Management"} />

      <FolderList />

      <Toaster richColors position="top-center" />
    </div>
  );
};

export default WorkshopPage;
