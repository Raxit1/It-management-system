import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import API from "../api/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: ""
  });

  // 1. FETCH EMPLOYEES FROM DATABASE
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error retrieving employee registry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. ADD NEW EMPLOYEE TO DATABASE
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Clean data payload formatting to match Pydantic validation schema
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary) || 0
      };

      await API.post("/employees", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh registry and clear form
      fetchEmployees();
      setFormData({ name: "", email: "", department: "", position: "", salary: "" });
    } catch (error) {
      console.error("Failed to commit employee creation:", error);
      if (error.response?.status === 403) {
        alert("Access Denied: Only Admin roles can add employees.");
      } else {
        alert("Registration failure. Check console or duplicate records.");
      }
    }
  };

  // 3. DELETE EMPLOYEE FROM DATABASE
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error("Failed to purge employee file:", error);
      if (error.response?.status === 403) {
        alert("Access Denied: Only Admin roles can delete entries.");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="page">
          <h1 className="page-title">Employee Directory</h1>

          {/* Form container */}
          <form className="form-container" onSubmit={addEmployee}>
            <div className="form-grid">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Corporate Email Address" value={formData.email} onChange={handleChange} required />
              <input type="text" name="department" placeholder="Department Branch" value={formData.department} onChange={handleChange} required />
              <input type="text" name="position" placeholder="Role Assignment / Title" value={formData.position} onChange={handleChange} required />
              <input type="number" name="salary" placeholder="Monthly Salary ($)" value={formData.salary} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-add">Register Employee</button>
          </form>

          {/* Table container */}
          {loading ? (
            <Loader message="Synchronizing enterprise user registry ledger..." />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department Focus</th>
                  <th>Position</th>
                  <th>Salary Allocation</th>
                  <th>Management Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td><strong>{employee.name}</strong></td>
                    <td>{employee.email}</td>
                    <td><span className="badge inprogress">{employee.department}</span></td>
                    <td>{employee.position}</td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => deleteEmployee(employee.id)}>
                        Terminate Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && employees.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "30px", color: "#64748b", marginTop: "20px" }}>
              No employee rows logged for your company code yet.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}