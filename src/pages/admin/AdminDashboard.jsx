import { useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHome from "./AdminHome";
import AdminComplaints from "./AdminComplaints";
import AdminUsers from "./AdminUsers";
import "./AdminDashboard.css";
import BusManagement from "./BusManagement";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      <AdminNavbar />
      <AdminSidebar setActivePage={setActivePage} />

      <div className="main-content">
        {activePage === "dashboard" && <AdminHome />}
        {activePage === "complaints" && <AdminComplaints />}
        {activePage === "users" && <AdminUsers />}
        {activePage === "bus" && <BusManagement />}
      </div>
    </>
  );
}
