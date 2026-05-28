import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", // CHANGED FROM username TO MATCH THE REGISTER SCHEMA
    email: "",
    password: "",
    role: "admin",
    company_id: "1", 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // EXACT PAYLOAD MAPPING: No more 422 errors!
    const cleanPayload = {
      name: formData.name.trim(), // MATCHES backend schema "name" key
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      company_id: parseInt(formData.company_id, 10), // STRICT INT CAST
    };

    try {
      const response = await API.post("/register", cleanPayload);
      console.log("Registration successful:", response.data);
      // Redirect straight to login view "/" (Since your Login component is mounted at root)
      navigate("/"); 
    } catch (err) {
      console.error("Validation Breakdown Response:", err.response?.data || err);
      const backendMessage = err.response?.data?.detail;
      setError(
        typeof backendMessage === "string" 
          ? backendMessage 
          : "Registration payload failed backend schema constraints. Check console logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Create Corporate Account</h2>
      
      {error && <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          name="name" // UPDATED TO MATCH STATE PROPERTY
          placeholder="Your Full Name"
          value={formData.name} // UPDATED TO MATCH STATE PROPERTY
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Corporate Email"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Secure Password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="number"
          name="company_id"
          placeholder="Tenant Company ID"
          value={formData.company_id}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}
        >
          <option value="admin">Administrator / Manager</option>
          <option value="employee">Staff / Employee</option>
        </select>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: "12px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Registering tenant profile..." : "Register Profile Instance"}
        </button>
      </form>
      
      <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
        Already have a tenant space? <Link to="/">Sign In</Link> 
      </p>
    </div>
  );
}

export default Register;