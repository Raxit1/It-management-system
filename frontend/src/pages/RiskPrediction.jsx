import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function RiskPrediction() {
    const [isOpen, setIsOpen] = useState(false);
    const [teamSize, setTeamSize] = useState("");
    const [duration, setDuration] = useState("");
    const [budget, setBudget] = useState("");
    const [complexity, setComplexity] = useState("Select Complexity");
    const [pendingTasks, setPendingTasks] = useState("");
    const [result, setResult] = useState(null);

    const predictRisk = () => {
        let score = 0;

        // TEAM SIZE ANALYSIS
        if (teamSize && parseInt(teamSize) < 3) {
            score += 3;
        } else if (teamSize && parseInt(teamSize) < 6) {
            score += 2;
        }

        // TIMELINE ANALYSIS
        if (duration && parseInt(duration) > 12) {
            score += 3;
        } else if (duration && parseInt(duration) > 6) {
            score += 2;
        }

        // ARCHITECTURE COMPLEXITY
        if (complexity === "High") {
            score += 3;
        } else if (complexity === "Medium") {
            score += 2;
        }

        // BACKLOG LOAD
        if (pendingTasks && parseInt(pendingTasks) > 20) {
            score += 3;
        } else if (pendingTasks && parseInt(pendingTasks) > 10) {
            score += 2;
        }

        // CALIBRATE LEVEL
        let risk = "Low";
        if (score >= 9) {
            risk = "High";
        } else if (score >= 5) {
            risk = "Medium";
        }

        let recommendation = "";
        if (risk === "High") {
            recommendation = "Critical Action Required: Increase workforce capacity and reduce project scope immediately.";
        } else if (risk === "Medium") {
            recommendation = "Warning Status: Monitor sprint metrics weekly and reallocate secondary tasks.";
        } else {
            recommendation = "Stable Status: All operational parameters look clear and within baseline limits.";
        }

        setResult({ score, risk, recommendation });
    };

    return (
        <div className="layout">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="main">
                <Navbar />
                <div className="page">
                    <h1 className="page-title">AI Predictive Risk Engine</h1>

                    <div className="task-form" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
                            <input
                                type="number"
                                placeholder="Total Team Size"
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Project Duration (Months)"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Total Budget Allocations ($)"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                            <select
                                value={complexity}
                                onChange={(e) => setComplexity(e.target.value)}
                                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            >
                                <option disabled value="Select Complexity">Select Complexity</option>
                                <option value="Low">Low Complexity</option>
                                <option value="Medium">Medium Complexity</option>
                                <option value="High">High Complexity</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Current Pending Tasks Counter"
                                value={pendingTasks}
                                onChange={(e) => setPendingTasks(e.target.value)}
                            />
                        </div>

                        <button
                            className="login-button"
                            style={{ maxWidth: "250px", marginTop: "10px" }}
                            onClick={predictRisk}
                        >
                            Execute Analysis Run
                        </button>
                    </div>

                    {result && (
                        <div className="dashboard-cards" style={{ marginTop: "30px" }}>
                            <div className="dashboard-card">
                                <h3>Total Evaluation Score</h3>
                                <p style={{ color: "#2563eb" }}>{result.score} / 12</p>
                            </div>

                            <div className="dashboard-card">
                                <h3>Calculated Risk Threat Level</h3>
                                <p>
                                    <span className={`badge ${
                                        result.risk === "High" ? "status-inactive" : 
                                        result.risk === "Medium" ? "priority-medium-badge" : "status-active"
                                    }`} style={{ fontSize: "20px", padding: "4px 16px" }}>
                                        {result.risk} Risk
                                    </span>
                                </p>
                            </div>

                            <div className="dashboard-card" style={{ gridColumn: "span 2" }}>
                                <h3>Automated Systems Recommendation</h3>
                                <p style={{ fontSize: "15px", fontWeight: "normal", color: "#475569", marginTop: "10px" }}>
                                    {result.recommendation}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RiskPrediction;