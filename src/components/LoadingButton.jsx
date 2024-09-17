import React from "react";
import { PulseLoader } from "react-spinners";

const LoadingButton = ({ loading, text }) => {
  return (
    <>{loading ? <PulseLoader size={10} color="white" /> : <p className="">{text}</p>}</>
  );
};

export default LoadingButton;
