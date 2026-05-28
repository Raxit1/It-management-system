import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import Loader from "../components/Loader";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    company_name: "", 
    email: "",
    phone: "",
    address: "" 
});

  useEffect(() => {
    fetchClients();
  }, []);

  // 1. FETCH LIVE MULTI-TENANT CLIENT RECORD LEDGERS
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Database connection dropped on client layer:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. AUTHORIZED COMMIT FLOW TO POSTGRESQL ENGINE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      await API.post("/clients", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear states and pull fresh row layouts
      setFormData({
        name: "",
        company_name: "",
        email: "",
        phone: "",
        address: ""
      });
      fetchClients();
    } catch (error) {
      console.error("Submission failed on client cluster:", error);
      alert("Verification issue: Ensure you are logged in as an Admin.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Enterprise Clients Matrix</h1>

      {/* Corporate Client Creation Form Console */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Account Manager / Contact Name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="company_name"
            placeholder="Enterprise Brand Name"
            value={formData.company_name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Corporate Email Link"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Direct Contact Line"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Headquarters Address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="btn btn-add" disabled={loading}>
          {loading ? "Processing..." : "Add Client Profile"}
        </button>
      </form>

      {/* Synchronized Data Views Display Grid Table */}
      {loading ? (
        <Loader message="Querying corporate client asset registries..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID Column</th>
              <th>Primary Contact Name</th>
              <th>Company Group</th>
              <th>Communication Link</th>
              <th>Phone Asset</th>
              <th>Geographical Address</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td><strong>#{client.id}</strong></td>
                <td>{client.name}</td>
                <td><span className="badge active">{client.company_name}</span></td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && clients.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "30px", color: "#64748b", marginTop: "20px" }}>
          No enterprise accounts are currently associated with your tenancy framework code.
        </div>
      )}
    </Layout>
  );
}

export default Clients;