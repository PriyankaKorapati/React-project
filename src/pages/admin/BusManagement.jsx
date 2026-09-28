import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./BusManagement.css";
import { FaCheckCircle, FaBus, FaExclamationTriangle } from "react-icons/fa";

export default function BusManagement() {
  const [buses, setBuses] = useState([]);

  const fetchBuses = async () => {
    const { data } = await supabase.from("buses").select("*");
    setBuses(data || []);
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const updateStatus = async (id, newStatus) => {
    console.log("Updating: ", id, newStatus);

    const { data, error } = await supabase.from("buses")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", id).select();

    console.log("Updated data: ", data);
    console.log("Updated error: ", error);

    if (!error) {
      fetchBuses();
    } else {
      alert("update failed");
    }
  };

  return (
    <div className="admin-bus-page">
      <h2> Bus Management</h2>

      {buses.map((bus) => (
        <div key={bus.id} className="admin-bus-card">
          <h4>{bus.bus_no}</h4>
          <p>Status: {bus.status}</p>

          {/* <div className="btn-row">
            <button onClick={() => updateStatus(bus.id, "At Campus")}>
              🟢 Campus
            </button>

            <button onClick={() => updateStatus(bus.id, "On the Way")}>
              🟡 Way
            </button>

            <button onClick={() => updateStatus(bus.id, "Delayed")}>
              🔴 Delay
            </button>
          </div> */}

          <div className="btn-row">
            <button
              className="status-btn campus"
              onClick={() => updateStatus(bus.id, "At Campus")}
            >
              <FaCheckCircle /> Campus
            </button>

            <button
              className="status-btn way"
              onClick={() => updateStatus(bus.id, "On the Way")}
            >
              <FaBus /> On the Way
            </button>

            <button
              className="status-btn delay"
              onClick={() => updateStatus(bus.id, "Delayed")}
            >
              <FaExclamationTriangle /> Delayed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}