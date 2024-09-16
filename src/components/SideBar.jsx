import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
 const navigate = useNavigate()
     const handleLogout = () => {
 navigate("/login")
     }
  return (
    <div className="w-28 md:w-64 h-screen inset-0 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-bold text-center">Scania Fault Code</h2>
      </div>
      <ul className="space-y-1">
        <Link to={"/"}>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">Type Code</li>
        </Link>

        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          Manage Knowledge
        </li>

        <Link to={"/wiring-diagram"}>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            Manage Wiring Diagram
          </li>
        </Link>

        <button onClick={handleLogout} className="w-full items-start flex justify-start">
          <p className="p-4 hover:bg-gray-700 w-full flex justify-start  cursor-pointer">Logout</p>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
