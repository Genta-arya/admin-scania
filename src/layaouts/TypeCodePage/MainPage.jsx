import React from "react";
import TableTypeCode from "./components/TableTypeCode";
import Header from "../../components/Header";
import { Toaster } from "sonner";
import LayoutContainer from "../components/LayoutContainer";

const TypeCodePage = () => {
  return (
  <LayoutContainer title={"Type Code Management"}>
    <TableTypeCode />
  </LayoutContainer>
  );
};

export default TypeCodePage;
