import React from "react";
import { FaFilePdf } from "react-icons/fa";

const RenderData = ({ data, handleRightClick, handleDeleteFile }) => {
  return (
    <>
      <div className="flex flex-col  mt-8">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 border-b py-5 pb-2 "
          >
            <div
              className="flex items-center gap-2 hover:cursor-pointer hover:underline"
              onContextMenu={(e) => handleRightClick(e, item)}
              onDoubleClick={(e) => handleRightClick(e, item)}
        
            >
              <FaFilePdf className="text-red-600 text-3xl mb-4" />

              <p className="text-center font-semibold text-gray-700 mb-4 md:max-w-60 lg:max-w-60 max-w-32 w-full  truncate text-sm md:text-base lg:text-base">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RenderData;
