import Layout from "../components/Layout";

import {
  FolderKanban,
  ListTodo,
  Clock3,
  MessageCircle,
  CheckCircle2,
  TimerReset
} from "lucide-react";

export default function EmployeeDashboard() {

  const tasks = [
    {
      title: "Complete UI Dashboard",
      desc: "Update analytics UI before Friday deployment.",
      status: "Pending"
    },
    {
      title: "API Integration",
      desc: "Connect frontend notifications with backend API.",
      status: "In Progress"
    },
    {
      title: "Authentication Testing",
      desc: "Verify JWT session management workflow.",
      status: "Completed"
    }
  ];

  return (

    <Layout>

      <div className="employee-dashboard">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="employee-header">

          <div>

            <h1>
              Employee Workspace
            </h1>

            <p>
              Welcome back. Here's your productivity overview.
            </p>

          </div>

          <button className="employee-action-btn">
            View Reports
          </button>

        </div>

        {/* =========================================
            STATS
        ========================================= */}

        <div className="employee-stats-grid">

          <div className="employee-stat-card">

            <div className="employee-stat-icon blue">
              <FolderKanban size={24} />
            </div>

            <div>
              <span>Assigned Projects</span>
              <h2>4</h2>
            </div>

          </div>

          <div className="employee-stat-card">

            <div className="employee-stat-icon orange">
              <ListTodo size={24} />
            </div>

            <div>
              <span>Pending Tasks</span>
              <h2>12</h2>
            </div>

          </div>

          <div className="employee-stat-card">

            <div className="employee-stat-icon green">
              <Clock3 size={24} />
            </div>

            <div>
              <span>Hours Worked</span>
              <h2>38h</h2>
            </div>

          </div>

          <div className="employee-stat-card">

            <div className="employee-stat-icon purple">
              <MessageCircle size={24} />
            </div>

            <div>
              <span>Messages</span>
              <h2>7</h2>
            </div>

          </div>

        </div>

        {/* =========================================
            MAIN GRID
        ========================================= */}

        <div className="employee-main-grid">

          {/* TASKS */}

          <div className="employee-tasks-section">

            <div className="section-title-row">

              <h2>
                My Tasks
              </h2>

              <span>
                12 Active Tasks
              </span>

            </div>

            <div className="employee-task-list">

              {tasks.map((task, index) => (

                <div
                  className="employee-task-card"
                  key={index}
                >

                  <div className="task-left">

                    <div className="task-status-line"></div>

                    <div>

                      <h3>
                        {task.title}
                      </h3>

                      <p>
                        {task.desc}
                      </p>

                    </div>

                  </div>

                  <div>

                    <span className={`task-badge ${task.status.replace(" ", "-").toLowerCase()}`}>
                      {task.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="employee-activity-section">

            <h2>
              Recent Activity
            </h2>

            <div className="activity-list">

              <div className="activity-item">

                <CheckCircle2 size={18} />

                <div>
                  <h4>Task Completed</h4>
                  <p>Authentication module verified</p>
                </div>

              </div>

              <div className="activity-item">

                <TimerReset size={18} />

                <div>
                  <h4>Project Updated</h4>
                  <p>ERP Dashboard progress synced</p>
                </div>

              </div>

              <div className="activity-item">

                <MessageCircle size={18} />

                <div>
                  <h4>New Message</h4>
                  <p>Team lead commented on task</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}