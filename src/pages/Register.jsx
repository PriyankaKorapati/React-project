import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

//   const [name, setName] = useState("");
// const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    phone: ""
  });

const handleRegister = async () => {

  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password
  });

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  let user = null;

  for (let i = 0; i < 5; i++) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData.session?.user;

    if (user) break;

    await new Promise((res) => setTimeout(res, 500));
  }

  if (!user) {
    alert("Session not ready. Please login manually.");
    return;
  }

  const { error: insertError } = await supabase.from("profiles").insert([
    {
      id: user.id,
      name: form.name,
      role: form.role,
      department: form.department,
      phone: form.phone
    }
  ]);

  if (insertError) {
    console.log(insertError);
    alert("Profile insert failed");
    return;
  }

  alert("Registered Successfully");
  navigate("/login");
};
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        <input type="text" placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input type="text" placeholder="Department"
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />

        <input type="text" placeholder="Phone Number"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}