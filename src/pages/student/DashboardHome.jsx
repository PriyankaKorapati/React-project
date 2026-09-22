import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./DashboardHome.css";
import { FaClipboardList, FaCheckCircle, FaClock } from "react-icons/fa";

export default function DashboardHome() {

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  });

  // 📊 FETCH DATA
  const fetchStats = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data, error } = await supabase
      .from("complaints")
      .select("status")
      .eq("user_id", userData.user.id);

    if (!error && data) {
      const total = data.length;
      const resolved = data.filter(c => c.status === "Resolved").length;
      const pending = data.filter(c => c.status === "Pending").length;

      setStats({ total, resolved, pending });
    }
  };

  useEffect(() => {
    fetchStats();

    // 🔥 REALTIME UPDATE
    const channel = supabase
      .channel("complaints-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "complaints" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="s-dashboard-home">

      <div className="s-dashboard-header">
        <h2 className="s-dashboard-title">Student Dashboard</h2>
      </div>

      <div className="s-card-grid">

        <div className="s-card total">
          <div className="s-card-icon">
            <FaClipboardList />
          </div>
          <div>
            <h4>Total</h4>
            <p className="s-number">{stats.total}</p>
            <span className="s-sub">All complaints</span>
          </div>
        </div>

        <div className="s-card resolved">
          <div className="s-card-icon">
            <FaCheckCircle />
          </div>
          <div>
            <h4>Resolved</h4>
            <p className="s-number">{stats.resolved}</p>
            <span className="s-sub">Completed</span>
          </div>
        </div>

        <div className="s-card pending">
          <div className="s-card-icon">
            <FaClock />
          </div>
          <div>
            <h4>Pending</h4>
            <p className="s-number">{stats.pending}</p>
            <span className="s-sub">Waiting</span>
          </div>
        </div>

      </div>
    </div>
  );
}