import { useState } from "react";
import Sidebar from "../../components/student/Sidebar";
import TopNavbar from "../../components/student/TopNavbar";
import DashboardHome from "./DashboardHome";
import Complaints from "./Complaints";
import Profile from "./Profile";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [active, setActive] = useState("home");

  const renderContent = () => {
    switch (active) {
      case "home":
        return <DashboardHome />;
      case "profile":
        return <Profile />;
      case "complaints":
        return <Complaints />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar setActive={setActive} />

      <div className="dashboard-main">
        <TopNavbar />

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}