import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Estimator() {
  const [inputs, setInputs] = useState({
    developers: 1,
    months: 1,
    complexity: "Simple",
  });
  const [totalEstimate, setTotalEstimate] = useState(0);

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Base pricing algorithm rules
    let baseRatePerDevMonth = 4000; 
    let multiplier = 1.0;

    if (inputs.complexity === "Medium") multiplier = 1.3;
    if (inputs.complexity === "Complex") multiplier = 1.7;

    const finalEstimate = inputs.developers * inputs.months * baseRatePerDevMonth * multiplier;
    setTotalEstimate(finalEstimate);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="page">
          <h1 className="page-title">Project Cost Estimator</h1>

          <div className="estimator-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px" }}>
            {/* Calculation Parameters */}
            <form onSubmit={handleCalculate} className="task-form" style={{ display: "flex", flexDirection: "column", gap: "15px", margin: 0 }}>
              <label>Number of Developers</label>
              <input 
                type="number" 
                min="1" 
                value={inputs.developers} 
                onChange={(e) => setInputs({ ...inputs, developers: parseInt(e.target.value) || 1 })}
              />

              <label>Project Duration (Months)</label>
              <input 
                type="number" 
                min="1" 
                value={inputs.months} 
                onChange={(e) => setInputs({ ...inputs, months: parseInt(e.target.value) || 1 })}
              />

              <label>Architecture Complexity</label>
              <select value={inputs.complexity} onChange={(e) => setInputs({ ...inputs, complexity: e.target.value })}>
                <option value="Simple">Simple (Static Apps, Basic Tools)</option>
                <option value="Medium">Medium (E-Commerce, Custom CRM)</option>
                <option value="Complex">Complex (AI Systems, Multi-Tenant SaaS)</option>
              </select>

              <button type="submit" style={{ marginTop: "10px" }}>Calculate Total Budget</button>
            </form>

            {/* Price Output Display Card */}
            <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <h2 style={{ color: "gray", marginBottom: "15px" }}>Estimated Project Value</h2>
              <p style={{ fontSize: "42px", color: "#2563eb" }}>${totalEstimate.toLocaleString()}</p>
              <span style={{ fontSize: "13px", color: "gray", marginTop: "10px" }}>*Includes operational buffers and role complexity adjustments.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}