import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function CreateCompany() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "Rax",
    company_code: "21",
    company_email: "Rax@gmail.com",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Matches your exact schema variables perfectly
    const companyPayload = {
      company_name: formData.company_name.trim(),
      company_code: formData.company_code.trim(),
      company_email: formData.company_email.trim(),
    };

    try {
      const response = await API.post("/companies", companyPayload);
      console.log("Company initialized:", response.data);
      setMessage(`Company created successfully! Assigned DB ID: ${response.data.id}`);
      
      // Optional: Automatically switch over to register the admin user under this ID
      setTimeout(() => navigate("/register"), 2000);
    } catch (err) {
      console.error("API error:", err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to initialize company structural layer.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "25px", border: "1px solid #cbd5e1", borderRadius: "12px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1e293b" }}>Initialize Tenant Space</h2>
      
      {message && <div style={{ color: "#15803d", backgroundColor: "#f0fdf4", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>{message}</div>}
      {error && <div style={{ color: "#b91c1c", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <input type="text" name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} required />
        <input type="text" name="company_code" placeholder="Company Code (Unique)" value={formData.company_code} onChange={handleChange} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} required />
        <input type="email" name="company_email" placeholder="Corporate Email Contact" value={formData.company_email} onChange={handleChange} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} required />
        
        <button type="submit" style={{ padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#10b981", color: "white", cursor: "pointer", fontWeight: "600" }}>
          Launch Company Space
        </button>
      </form>
    </div>
  );
}

export default CreateCompany;