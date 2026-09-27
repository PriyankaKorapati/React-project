// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import {
//   PieChart, Pie, Cell, Tooltip,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   ResponsiveContainer
// } from "recharts";

// import "./AdminHome.css";

// export default function AdminHome() {

//   const [department, setDepartment] = useState("All");
//   const [dateFilter, setDateFilter] = useState("All");

//   const [tempDepartment, setTempDepartment] = useState("All");
//   const [tempDateFilter, setTempDateFilter] = useState("All");

//   const [stats, setStats] = useState({
//     users: 0,
//     complaints: 0,
//     pending: 0,
//     resolved: 0
//   });

//   const [pieData, setPieData] = useState([]);

//   const [barData, setBarData] = useState([]);
//   const [notification, setNotification] = useState("");

//   const fetchData = async () => {

//     let query = supabase.from("complaints").select("*");

//     if (department !== "All") {
//       query = query.eq("category", department);
//     }

//     if (dateFilter !== "All") {
//       const days = parseInt(dateFilter);
//       const past = new Date();
//       past.setDate(past.getDate() - days);

//       query = query.gte("created_at", past.toISOString());
//     }

//     const { data: complaints } = await query;
//     const { data: users } = await supabase.from("profiles").select("*");

//     if (!complaints) return;

//     const pending = complaints.filter(c => c.status === "Pending").length;
//     const resolved = complaints.filter(c => c.status === "Resolved").length;

//     setStats({
//       users: users?.length || 0,
//       complaints: complaints.length,
//       pending,
//       resolved
//     });

//     setPieData([
//       { name: "Pending", value: pending },
//       { name: "Resolved", value: resolved }
//     ]);

//     const categoryMap = {};
//     complaints.forEach(c => {
//       categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
//     });

//     setBarData(
//       Object.keys(categoryMap).map(key => ({
//         category: key,
//         count: categoryMap[key]
//       }))
//     );
//   };


//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const channel = supabase
//       .channel("live-dashboard")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "complaints" },
//         () => {
//           setNotification("🚨 New Complaint!");
//           fetchData();
//           setTimeout(() => setNotification(""), 3000);
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, []);

//   const COLORS = ["#f59e0b", "#10b981"];

//   const exportCSV = () => {
//     const rows = [
//       ["Category", "Count"],
//       ...barData.map(c => [c.category, c.count])
//     ];

//     const csv =
//       "data:text/csv;charset=utf-8," +
//       rows.map(r => r.join(",")).join("\n");

//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "report.csv";
//     link.click();
//   };

//   const applyFilters = () => {
//     setDepartment(tempDepartment);
//     setDateFilter(tempDateFilter);
//     fetchData();
//   };

//   return (
//     <div className="dashboard-container">

//       <h2 className="page-title">Admin Dashboard</h2>

//       <div className="filters">
//         <select value={tempDepartment} onChange={(e) => setTempDepartment(e.target.value)}>
//           <option value="All">All Departments</option>
//           <option value="Academics">Academics</option>
//           <option value="Transport">Transport</option>
//           <option value="Hostel">Hostel</option>
//         </select>

//         <select value={tempDateFilter} onChange={(e) => setTempDateFilter(e.target.value)}>
//           <option value="All">All Time</option>
//           <option value="5">Last 5 Days</option>
//           <option value="7">Last 7 Days</option>
//           <option value="30">Last 30 Days</option>
//         </select>

//         <button onClick={applyFilters}>Apply</button>
//         <button onClick={exportCSV}>Export</button>
//       </div>

//       {notification && <div className="notification">{notification}</div>}

//       <div className="cards">
//         <div className="card"><h4>Users</h4><p>{stats.users}</p></div>
//         <div className="card"><h4>Complaints</h4><p>{stats.complaints}</p></div>
//         <div className="card"><h4>Pending</h4><p>{stats.pending}</p></div>
//         <div className="card"><h4>Resolved</h4><p>{stats.resolved}</p></div>
//       </div>

//       <div className="charts-grid">
//         <div className="chart-box">
//           <h3>Status</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={pieData} dataKey="value" outerRadius={100}>
//                 {pieData.map((e, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <h3>Categories</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={barData}>
//               <CartesianGrid stroke="#334155" />
//               <XAxis dataKey="category" stroke="#cbd5f5" />
//               <YAxis stroke="#cbd5f5" />
//               <Tooltip />
//               <Bar dataKey="count" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "./AdminHome.css";

export default function AdminHome() {

  const [stats, setStats] = useState({
    users: 0,
    complaints: 0,
    pending: 0,
    resolved: 0
  });

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDate, setSelectedDate] = useState("All Time");

  const [appliedDepartment, setAppliedDepartment] = useState("All");
  const [appliedDate, setAppliedDate] = useState("All");

  const [showDept, setShowDept] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [notification, setNotification] = useState("");

  const fetchData = async () => {

    let query = supabase.from("complaints").select("*");

    if (appliedDepartment !== "All") {
      query = query.eq("category", appliedDepartment);
    }

    if (appliedDate !== "All") {
      const days = parseInt(appliedDate);
      const past = new Date();
      past.setDate(past.getDate() - days);
      query = query.gte("created_at", past.toISOString());
    }

    const { data: complaints } = await query;
    const { data: users } = await supabase.from("profiles").select("*");

    if (!complaints) return;

    const pending = complaints.filter(c => c.status === "Pending").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    setStats({
      users: users?.length || 0,
      complaints: complaints.length,
      pending,
      resolved
    });

    setPieData([
      { name: "Pending", value: pending },
      { name: "Resolved", value: resolved }
    ]);

    const categoryMap = {};
    complaints.forEach(c => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    setBarData(
      Object.keys(categoryMap).map(key => ({
        category: key,
        count: categoryMap[key]
      }))
    );
  };
  const handleApply = () => {
    setAppliedDepartment(
      selectedDepartment === "All Departments" ? "All" : selectedDepartment
    );

    if (selectedDate === "All Time") setAppliedDate("All");
    else if (selectedDate === "Last 5 Days") setAppliedDate("5");
    else if (selectedDate === "Last 7 Days") setAppliedDate("7");
    else if (selectedDate === "Last 30 Days") setAppliedDate("30");
  };
  useEffect(() => {
    fetchData();
  }, [appliedDepartment, appliedDate]);
  useEffect(() => {
    const channel = supabase
      .channel("live-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "complaints" },
        () => {
          setNotification("🚨 New Complaint!");
          fetchData();
          setTimeout(() => setNotification(""), 3000);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const COLORS = ["#f59e0b", "#22c55e"];
  const exportCSV = () => {
    const rows = [
      ["Category", "Count"],
      ...barData.map(c => [c.category, c.count])
    ];

    const csv =
      "data:text/csv;charset=utf-8," +
      rows.map(r => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "report.csv";
    link.click();
  };

  return (
    <div className="dashboard-container">

      <h2 className="page-title">Admin Dashboard</h2>
      <div className="filters">

        <div className="dropdown">
          <button onClick={() => setShowDept(!showDept)} className="dropdown-btn">
            {selectedDepartment}
          </button>

          {showDept && (
            <div className="dropdown-menu">
              {["All Departments", "Academics", "Transport", "Hostel"].map(item => (
                <div
                  key={item}
                  onClick={() => {
                    setSelectedDepartment(item);
                    setShowDept(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown">
          <button onClick={() => setShowDate(!showDate)} className="dropdown-btn">
            {selectedDate}
          </button>

          {showDate && (
            <div className="dropdown-menu">
              {["All Time", "Last 5 Days", "Last 7 Days", "Last 30 Days"].map(item => (
                <div
                  key={item}
                  onClick={() => {
                    setSelectedDate(item);
                    setShowDate(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleApply}>Apply</button>
        <button onClick={exportCSV}>Export</button>
      </div>
      {notification && <div className="notification">{notification}</div>}

      <div className="cards">
        <div className="card"><h4>Users</h4><p>{stats.users}</p></div>
        <div className="card"><h4>Complaints</h4><p>{stats.complaints}</p></div>
        <div className="card"><h4>Pending</h4><p>{stats.pending}</p></div>
        <div className="card"><h4>Resolved</h4><p>{stats.resolved}</p></div>
      </div>

      <div className="charts-grid">

        <div className="chart-box">
          <h3>Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((e, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="category" stroke="#cbd5f5" />
              <YAxis stroke="#cbd5f5" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}