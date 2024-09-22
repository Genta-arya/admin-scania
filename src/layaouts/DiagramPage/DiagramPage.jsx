import React from "react";
import Header from "../../components/Header";
import { Toaster } from "sonner";
import LayoutContainer from "../components/LayoutContainer";
import ListDiagramPdf from "./components/ListDiagramPdf";

const DiagramPage = () => {
  return (
    <LayoutContainer title={"Wiring Diagram Management"}>
      <ListDiagramPdf />
    </LayoutContainer>
  );
};

export default DiagramPage;
