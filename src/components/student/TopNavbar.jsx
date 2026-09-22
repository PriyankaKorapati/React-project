import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import "./TopNavbar.css";

export default function TopNavbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="s-topnav">
      <h2>Campus Command Center</h2>

      <div className="topnav-right">
        <div className="s-user-box">
          👤 <span>{user?.name}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}