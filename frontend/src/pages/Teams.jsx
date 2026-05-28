import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/api";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    team_name: "",
    department: "",
    team_lead: ""
  });

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/teams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.log("Back-end fallback initialized.");
      setTeams([
        { id: 1, team_name: "Cyber Ops Alpha", department: "Security", team_lead: "Alex Mercer" },
        { id: 2, team_name: "Cloud Architecture", department: "DevOps", team_lead: "Sarah Connor" }
      ]);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTeam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/teams", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeams();
      setFormData({ team_name: "", department: "", team_lead: "" });
    } catch (error) {
      setTeams([...teams, { id: Date.now(), ...formData }]);
      setFormData({ team_name: "", department: "", team_lead: "" });
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="page">
          <h1 className="page-title">Organizational Teams</h1>

          <form className="form-container" onSubmit={addTeam}>
            <div className="form-grid">
              <input type="text" name="team_name" placeholder="Team Designation Name" value={formData.team_name} onChange={handleChange} required />
              <input type="text" name="department" placeholder="Department Branch" value={formData.department} onChange={handleChange} required />
              <input type="text" name="team_lead" placeholder="Assigned Team Lead" value={formData.team_lead} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-add">Form Squad Team</button>
          </form>

          <table>
            <thead>
              <tr>
                <th>Squad Designation</th>
                <th>Core Department Focus</th>
                <th>Team Lead Officer</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td><strong>{team.team_name}</strong></td>
                  <td><span className="badge inprogress">{team.department}</span></td>
                  <td>{team.team_lead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}