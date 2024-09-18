import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import useSidebarStore from "../utils/useSidebarStore";

const Header = ({ title }) => {
    const { isSidebarVisible, toggleSidebar } = useSidebarStore();
  return (
    <div className="border-b border-gray-300  md:px-8 px-8 py-3 mb-4 bg-gray-800 text-white w-screen">
      <div className="flex items-center gap-1  text-sm">
        <div className="mr-4 cursor-pointer  transition-all  ease-in" onClick={toggleSidebar}>
          {" "}
          <AiOutlineMenu className="lg:text-xl text-white font-bold"  color="white "/>
        </div>
        <p className="font-bold text-white">Menu</p>
        <FaChevronRight className="text-white font-bold" />
        <p className="font-bold text-white">{title}</p>
      </div>
    </div>
  );
};

export default Header;
