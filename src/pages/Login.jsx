import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert("Invalid email or password");
      return;
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <h1>Campus Command Center</h1>
        <p>
          Manage complaints, track issues, and improve campus life
          with a centralized system.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <input type="email" placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input type="password" placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            } />

          <button onClick={handleLogin}>Login</button>

          <p> Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}