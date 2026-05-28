import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  ShieldAlert,
  Bell,
  Files,
  MessageCircle,
  Building2
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Sidebar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  let role = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (e) {
      console.error("Malformed authentication token caught:", e);
    }
  }

  // Helper function to dynamically calculate active navigation focus states
  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-circle">RX</div>
        <div className="logo-text">
          <h2>RaxERP</h2>
          <p>Enterprise Suite</p>
        </div>
      </div>
            
      <nav>
        

        {role === "admin" && (
          <><Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
            <Link to="/employees" className={getNavLinkClass("/employees")}>
              <Users size={18} />
              <span>Employees</span>
            </Link>

            <Link to="/projects" className={getNavLinkClass("/projects")}>
              <FolderKanban size={18} />
              <span>Projects</span>
            </Link>

            <Link to="/tasks" className={getNavLinkClass("/tasks")}>
              <ListTodo size={18} />
              <span>Tasks</span>
            </Link>

            <Link to="/risk" className={getNavLinkClass("/risk")}>
              <ShieldAlert size={18} />
              <span>AI Risk</span>
            </Link>

            <Link to="/clients" className={getNavLinkClass("/clients")}>
              <Building2 size={18} />
              <span>Clients</span>
            </Link>

            <Link to="/notifications" className={getNavLinkClass("/notifications")}>
              <Bell size={18} />
              <span>Notifications</span>
            </Link>
          </>
        )}

        {role === "employee" && (
          <>
          <Link to="/employee-dashboard" className={getNavLinkClass("/employee-dashboard")}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
            <Link to="/chat" className={getNavLinkClass("/chat")}>
              <MessageCircle size={18} />
              <span>Team Chat</span>
            </Link>

            <Link to="/documents" className={getNavLinkClass("/documents")}>
              <Files size={18} />
              <span>Documents</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;