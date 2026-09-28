import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "./context/AuthContext";
// import BusTracking from "./pages/student/BusTracking";
// import BusManagement from "./pages/admin/BusManagement";

function App() {
  const { user, loading } = useAuth();


  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route path="/dashboard"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <StudentDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          } />

        <Route path="*" element={<h2>Page Not Found</h2>} />
        {/* <Route path="/bus-tracking" element={<BusTracking />} /> */}
        {/* <Route path="/admin/bus-management" element={<BusManagement />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;