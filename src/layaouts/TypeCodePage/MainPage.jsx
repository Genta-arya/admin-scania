import React from "react";
import TableTypeCode from "./components/TableTypeCode";
import Header from "../../components/Header";
import { Toaster } from "sonner";

const TypeCodePage = () => {
  return (
    <div className="w-full ">
      <Header title={"Type Code Management"} />

      <TableTypeCode />

      <Toaster richColors position="top-center" />
    </div>
  );
};

export default TypeCodePage;
