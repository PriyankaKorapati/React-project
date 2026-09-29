// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import "./AdminUsers.css";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("name", { ascending: true }); 

//     if (error) {
//       console.log("Error:", error);
//     } else {
//       setUsers(data || []);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   if (loading) return <p>Loading users...</p>;

//   return (
//     <div className="users-container">
//       <h2 className="page-title">All Users</h2>

//       {users.length === 0 && <p>No users found</p>}

//       <div className="users-table"> 
//         <div className="table-header">
//           <span>Name</span>
//           <span>Role</span>
//           <span>Department</span>
//           <span>Phone</span>
//         </div>

//         {users.map((user) => (
//           <div className="table-row" key={user.id}> 
//             <span>{user.name}</span>
//             <span className={`role ${user.role}`}>
//               {user.role}
//             </span>
//             <span>{user.department || "-"}</span>
//             <span>{user.phone || "-"}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.log("Error:", error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 FILTER USERS
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ DELETE USER
  const deleteUser = async (id) => {
    const confirm = window.confirm("Delete this user?");
    if (!confirm) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (!error) fetchUsers();
  };

  // 🔄 CHANGE ROLE
  // const changeRole = async (id, role) => {
  //   const { error } = await supabase
  //     .from("profiles")
  //     .update({ role })
  //     .eq("id", id);

  //   if (!error) fetchUsers();
  // };

  const changeRole = async (id, role) => {
  console.log("Changing role:", id, role);

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Role update error:", error);
  } else {
    console.log("Updated:", data);
    fetchUsers();
  }
};

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="users-container">
      <h2 className="page-title">All Users</h2>

      <input
        className="search-box"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} />

      {filteredUsers.length === 0 && <p>No users found</p>}

      <div className="users-table">
        <div className="table-header">
          <span>Name</span>
          <span>Role</span>
          <span>Department</span>
          <span>Phone</span>
          <span>Actions</span>
        </div>

        {filteredUsers.map((user) => (
          <div className="table-row" key={user.id}>
            <span>{user.name}</span>

            <span className={`role ${user.role}`}>
              {user.role}
            </span>

            <span>{user.department || "-"}</span>
            <span>{user.phone || "-"}</span>

            <div className="actions">
              {/* ROLE CHANGE */}
              <button onClick={() =>
                changeRole(user.id, user.role === "admin" ? "student" : "admin")
              }>
                Change Role
              </button>
              <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}