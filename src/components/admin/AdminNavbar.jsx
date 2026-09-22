import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", userData.user.id)
        .single();

      if (data) setName(data.name);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="topnav">
      <h2>Admin Panel</h2>

      <div className="topnav-right">
        <div className="user-box">
          👤 {name || "Admin"}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}