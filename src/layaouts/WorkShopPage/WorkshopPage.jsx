import React from "react";

import FolderList from "./components/FolderList";
import LayoutContainer from "../components/LayoutContainer";

const WorkshopPage = () => {
  return (
    <LayoutContainer title={"Workshop Management"}>
      <FolderList />
    </LayoutContainer>
  );
};

export default WorkshopPage;
