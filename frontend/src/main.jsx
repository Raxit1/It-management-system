import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Teams from "./pages/Teams";
import TeamChat from "./pages/TeamChat";
import ScrumBoard from "./pages/ScrumBoard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Clients from "./pages/Clients";
import Estimator from "./pages/Estimator";
import Timeline from "./pages/Timeline";
import RiskPrediction from "./pages/RiskPrediction";
import Documents from "./pages/Documents";
import CreateCompany from "./pages/CreateCompany";
import Notifications from "./pages/Notifications";
import "./styles/global.css";
import "./index.css";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import "./styles/main.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth & Setup */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-company" element={<CreateCompany />} />
        
        {/* Core Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/chat" element={<TeamChat />} />
        <Route path="/scrum" element={<ScrumBoard />} />

        {/* Management & Metrics */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/estimator" element={<Estimator />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/risk" element={<RiskPrediction />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/employee-dashboard"element={<EmployeeDashboard />}
/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);