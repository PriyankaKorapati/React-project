
import { useState } from "react";
import { FaClipboardList, FaUsers, FaChartBar } from "react-icons/fa";
import "./AdminSidebar.css";


export default function AdminSidebar({ setActivePage }) {
  const [active, setActive] = useState("dashboard");

  const handleClick = (page) => {
    setActive(page);
    setActivePage(page);
  };

  return (
    <div className="sidebar">
      <button
        className={active === "dashboard" ? "active" : ""}
        onClick={() => handleClick("dashboard")}
      >
        <FaChartBar /> Dashboard
      </button>

      <button
        className={active === "complaints" ? "active" : ""}
        onClick={() => handleClick("complaints")}
      >
        <FaClipboardList /> Complaints
      </button>

      <button
        className={active === "users" ? "active" : ""}
        onClick={() => handleClick("users")}
      >
        <FaUsers /> Users
      </button>
      
    
    </div>
  );
}