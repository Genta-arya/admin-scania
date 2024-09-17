import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineCode,
  AiOutlineBook,
  AiOutlineDatabase,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { FaFileArchive, FaTimes } from "react-icons/fa";
import useSidebarStore from "../utils/useSidebarStore";
import { motion, AnimatePresence } from "framer-motion";
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleLogout = () => {
    navigate("/login");
  };
  const { isSidebarVisible, toggleSidebar } = useSidebarStore();

  return (
    <>
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 "
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 300  }}
          className={`min-h-screen w-52  bg-gray-800 text-white flex flex-col justify-between  items-center ${
            isSidebarVisible
              ? "block fixed "
              : "hidden transition-all ease-in"
          }`}
        >
          <div>
            <div className="p-4 border-b relative">
              <button onClick={toggleSidebar} className="absolute top-3 left-0">
                <FaTimes />
              </button>
              <h2 className="text-lg font-bold text-center  mt-8">
                R620 E-BrakeSys
              </h2>
            </div>
            <ul className="space-y-1 text-sm overflow-auto">
              <div className="mt-2">
                <Link to={"/"} title="Type Code">
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center ${
                      pathname === "/" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <AiOutlineCode className="mr-2 text-xl" />
                    <span className="">Type Code</span>
                  </li>
                </Link>

                <Link to={"/knowledge"} title="Knowledge">
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center relative ${
                      pathname === "/knowledge" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <AiOutlineBook className="mr-2 text-xl" />
                    <span className="">Knowledge</span>
                  </li>
                </Link>

                <Link to={"/wiring-diagram"}>
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center relative ${
                      pathname === "/wiring-diagram"
                        ? "font-bold border-b-4"
                        : ""
                    }`}
                  >
                    <AiOutlineDatabase className="mr-2 text-xl" />
                    <span className="">Wiring Diagram</span>
                  </li>
                </Link>

                <Link to={"/workshop"}>
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center relative ${
                      pathname === "/workshop" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <FaFileArchive className="mr-2 text-xl" />
                    <span className="">WorkShop</span>
                  </li>
                </Link>
              </div>
            </ul>
          </div>
          <button
            onClick={handleLogout}
            className="w-full items-start flex justify-start border-t"
          >
            <p className="p-4 hover:bg-gray-700 w-full flex md:justify-start lg:justify-start justify-center items-center relative cursor-pointer">
              <AiOutlineLogout className="mr-2 text-xl" />
              <span className="hidden md:block">Logout</span>
            </p>
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SideBar;
