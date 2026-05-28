import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Briefcase,
  ShieldAlert,
  Users
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Notifications() {

  const [isOpen, setIsOpen] = useState(false);

  /* =========================================================
     NOTIFICATION DATA
  ========================================================= */

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Project Assigned",
      message:
        "AI ERP System development lifecycle project assigned to your team workspace.",
      time: "2 min ago",
      type: "project",
      unread: true
    },
    {
      id: 2,
      title: "Critical Task Deadline",
      message:
        "Database schema standardization must be verified before tomorrow morning migration window.",
      time: "10 min ago",
      type: "task",
      unread: true
    },
    {
      id: 3,
      title: "HR Workspace Update",
      message:
        "Interview onboarding blocks scheduled for incoming cybersecurity analyst role.",
      time: "1 hour ago",
      type: "hr",
      unread: false
    },
    {
      id: 4,
      title: "Risk Threat Alert Triggered",
      message:
        "AI Risk score escalated to HIGH for Project Alpha due to pending backlogs.",
      time: "2 hours ago",
      type: "risk",
      unread: false
    }
  ]);

  /* =========================================================
     COUNTS
  ========================================================= */

  const unreadCount = notifications.filter(
    (n) => n.unread
  ).length;

  /* =========================================================
     MARK SINGLE READ
  ========================================================= */

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );
  };

  /* =========================================================
     MARK ALL READ
  ========================================================= */

  const markAllRead = () => {

    setNotifications(
      notifications.map((item) => ({
        ...item,
        unread: false
      }))
    );
  };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearAll = () => {
    setNotifications([]);
  };

  /* =========================================================
     ICONS
  ========================================================= */

  const getNotificationIcon = (type) => {

    switch (type) {

      case "project":
        return <Briefcase size={18} />;

      case "task":
        return <AlertTriangle size={18} />;

      case "risk":
        return <ShieldAlert size={18} />;

      case "hr":
        return <Users size={18} />;

      default:
        return <Bell size={18} />;
    }
  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="main">

        <Navbar
          toggleSidebar={() =>
            setIsOpen(!isOpen)
          }
        />

        <div className="page">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="notification-header">

            <div>

              <h1 className="notification-title">
                Notifications Center
              </h1>

              <p className="notification-subtitle">
                Manage all workspace alerts,
                system updates and operational activity.
              </p>

            </div>

            <div className="notification-actions">

              {unreadCount > 0 && (
                <button
                  className="mark-all-btn"
                  onClick={markAllRead}
                >
                  <CheckCheck size={16} />
                  Mark All Read
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  className="clear-btn"
                  onClick={clearAll}
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="notification-stats">

            <div className="notification-stat-card">

              <h3>
                Total Notifications
              </h3>

              <h1>
                {notifications.length}
              </h1>

            </div>

            <div className="notification-stat-card unread">

              <h3>
                Unread Alerts
              </h3>

              <h1>
                {unreadCount}
              </h1>

            </div>

          </div>

          {/* =================================================
              LIST
          ================================================= */}

          <div className="notifications-container">

            {notifications.length > 0 ? (

              notifications.map((item) => (

                <div
                  key={item.id}
                  className={`notification-card-modern ${
                    item.unread
                      ? "active"
                      : ""
                  }`}
                >

                  {/* LEFT ICON */}

                  <div
                    className={`notification-icon ${item.type}`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* CONTENT */}

                  <div className="notification-content">

                    <div className="notification-top">

                      <div>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.message}
                        </p>

                      </div>

                      {item.unread && (
                        <span className="new-badge">
                          NEW
                        </span>
                      )}

                    </div>

                    <div className="notification-footer">

                      <span>
                        {item.time}
                      </span>

                      {item.unread && (
                        <button
                          className="read-btn"
                          onClick={() =>
                            markAsRead(item.id)
                          }
                        >
                          Mark Read
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="empty-notifications">

                <Bell size={60} />

                <h2>
                  All caught up
                </h2>

                <p>
                  No notifications available right now.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}