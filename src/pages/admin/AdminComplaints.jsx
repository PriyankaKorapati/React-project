import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AdminComplaints.css";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchComplaints = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("complaints")
    .select(`
      id,
      title,
      description,
      category,
      status,
      created_at,
      user_id,
      image_url,
      profiles:profiles!complaints_user_id_fkey (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("DATA:", data);
    setComplaints(data || []);
  }

  setLoading(false);
};
  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) fetchComplaints();
    else alert("Error updating status");
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="complaints-container">
      <h2 className="page-title">Manage Complaints</h2>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h4>Total</h4>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h4>Pending</h4>
          <p>{pending}</p>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>
          <p>{resolved}</p>
        </div>
      </div>

      {complaints.length === 0 && (
        <p style={{ marginTop: "20px" }}>No complaints found</p>
      )}

      <div className="complaints-list">
        {complaints.map((item) => (
          <div className="complaint-card" key={item.id}>

            {/* LEFT SIDE */}
            <div className="card-left">
              <h4>{item.title}</h4>
              <p className="desc">{item.description}</p>

              {item.image_url && (
                <img
                  src={item.image_url}
                  alt="complaint"
                  className="complaint-img"
                />
              )}

              <p style={{ fontSize: "13px", color: "#64748b" }}>
                👤 {item.profiles?.name || "Unknown User"}
              </p>

              <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                {item.category}
              </p>
            </div>

            <div className="card-right">
              <span className={`status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>

              <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                {new Date(item.created_at).toLocaleDateString()}
              </p>

              {item.status === "Pending" && (
                <button
                  className="resolve-btn"
                  onClick={() => updateStatus(item.id, "Resolved")}
                >
                  Resolve
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}