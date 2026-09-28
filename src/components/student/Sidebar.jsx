import { useState } from "react";
import "./Sidebar.css";

import { FaHome, FaUser, FaClipboardList, FaBus} from "react-icons/fa";

export default function Sidebar({ setActive }) {
  const [activeTab, setActiveTab] = useState("home");

  const handleClick = (tab) => {
    setActive(tab);
    setActiveTab(tab);
  };

  return (
    <div className="s-sidebar">

      <button className={activeTab === "home" ? "active" : ""}
        onClick={() => handleClick("home")} >
        <FaHome className="icon" />
          Dashboard
      </button>

      <button className={activeTab === "profile" ? "active" : ""}
        onClick={() => handleClick("profile")} >
        <FaUser className="icon" />
          Profile
      </button>

      <button className={activeTab === "complaints" ? "active" : ""}
        onClick={() => handleClick("complaints")} >
        <FaClipboardList className="icon" />
          Complaints
      </button>

      <button className={activeTab === "bus-tracking" ? "active" : ""}
        onClick={() => handleClick("bus-tracking")} >
        <FaBus className="icon" />
          Bus Tracking
        </button>
    </div>
  );
}