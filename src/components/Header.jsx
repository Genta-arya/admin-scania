import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import useSidebarStore from "../utils/useSidebarStore";

const Header = ({ title }) => {
    const { isSidebarVisible, toggleSidebar } = useSidebarStore();
  return (
    <div className="border-b border-gray-300 -ml-3 md:px-8 px-8 py-3 mb-4">
      <div className="flex items-center gap-1  text-sm">
        <div className="mr-4 cursor-pointer  transition-all  ease-in" onClick={toggleSidebar}>
          {" "}
          <AiOutlineMenu className="lg:text-xl" />
        </div>
        <p className="font-bold text-gray-500">Menu</p>
        <FaChevronRight className="text-gray-500 font-bold" />
        <p className="font-bold text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default Header;
