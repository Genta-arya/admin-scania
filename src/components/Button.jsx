import React from "react";
import { PulseLoader } from "react-spinners";

const Button = ({
  onClick,
  text,
  bg = "bg-gray-800",
  icon,
  width = "w-20",
  loading,
}) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`px-2 py-2 ${bg}  ${width} text-xs text-white  font-bold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out  focus:outline-none focus:ring-4 focus:ring-gray-300 `}
    >
      {loading ? (
        <PulseLoader size={10} color="white" />
      ) : (
        <>
          {" "}
          <div className="flex items-center justify-center gap-2">
            {icon && <>{icon}</>}
            <p>{text}</p>
          </div>
        </>
      )}
    </button>
  );
};

export default Button;
