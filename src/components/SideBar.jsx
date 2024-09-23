import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineCode,
  AiOutlineBook,
  AiOutlineDatabase,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { FaBlog, FaFileArchive, FaTimes, FaUserCheck } from "react-icons/fa";
import useSidebarStore from "../utils/useSidebarStore";
import { motion, AnimatePresence } from "framer-motion";
import { FaGears, FaUserGear } from "react-icons/fa6";
import icon from "../assets/icon.jpg";
import handleError from "../utils/HandleError";
import { Logout } from "../service/API/authentikasi/_serviceAuthentikasi";
import LoadingGlobal from "./Loading";
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await Logout(token);
      navigate("/login");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const { isSidebarVisible, toggleSidebar } = useSidebarStore();
  if (pathname.startsWith("/detail") || pathname.startsWith("/manage/about")) {
    return null;
  }
  if (loading) return <LoadingGlobal />;

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
          transition={{ type: "spring", stiffness: 300, damping: 50 }}
          className={`min-h-screen w-52  bg-gray-800 text-white flex flex-col justify-between  items-center ${
            isSidebarVisible
              ? "block fixed top-0"
              : "hidden transition-all ease-in"
          }`}
        >
          <div>
            <div className="p-4 relative">
              <button onClick={toggleSidebar} className="absolute top-3 left-0">
                <FaTimes />
              </button>
              <div className="mt-8 flex justify-center">
                <img src={icon} className="md:w-32 lg:w-32 rounded-md w-24" />
              </div>
            </div>
            <ul className="space-y-1 text-sm overflow-auto">
              <div className="mt-2">
                <Link to={"/"} title="Type Code" onClick={toggleSidebar}>
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center ${
                      pathname === "/" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <FaGears className="mr-2 text-xl" />
                    <span className="">Type Code</span>
                  </li>
                </Link>

                <Link to={"/wiring-diagram"} onClick={toggleSidebar}>
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

                <Link to={"/workshop"} onClick={toggleSidebar}>
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center relative ${
                      pathname === "/workshop" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <FaFileArchive className="mr-2 text-xl" />
                    <span className="">WorkShop</span>
                  </li>
                </Link>

                <Link to={"/manage/about"} onClick={toggleSidebar}>
                  <li
                    className={`p-4 hover:bg-gray-700 cursor-pointer flex items-center relative ${
                      pathname === "/workshop" ? "font-bold border-b-4" : ""
                    }`}
                  >
                    <FaBlog className="mr-2 text-xl" />
                    <span className="">Manage About</span>
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
