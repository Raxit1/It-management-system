import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  Settings2,
  X
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  toggleSidebar
}) {

  const navigate = useNavigate();

  /* =========================================================
     STATES
  ========================================================= */

  const [userProfile, setUserProfile] = useState({
    name: "User",
    role: "Team Member"
  });

  const [notificationCount, setNotificationCount] = useState(3);

  const [currentTime, setCurrentTime] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned"
    },
    {
      id: 2,
      title: "Project Deadline Tomorrow"
    },
    {
      id: 3,
      title: "Meeting at 4 PM"
    }
  ]);

  /* =========================================================
     LIVE CLOCK
  ========================================================= */

  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);

  }, []);

  /* =========================================================
     DECODE USER TOKEN
  ========================================================= */

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      try {

        const decoded = jwtDecode(token);

        setUserProfile({
          name: decoded.name || decoded.sub || "Raxit",
          role: decoded.role
            ? decoded.role.charAt(0).toUpperCase() +
              decoded.role.slice(1)
            : "Administrator"
        });

      } catch (error) {

        console.error("JWT Decode Error:", error);

      }
    }

  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (e) => {

    const query = e.target.value;

    if (setSearchQuery) {
      setSearchQuery(query);
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {

      localStorage.removeItem("token");

      navigate("/");

    }
  };

  /* =========================================================
     NOTIFICATION HANDLER
  ========================================================= */

  const toggleNotifications = () => {

    setShowNotifications(!showNotifications);

    setShowSettings(false);

    setNotificationCount(0);

  };

  /* =========================================================
     SETTINGS HANDLER
  ========================================================= */

  const toggleSettings = () => {

    setShowSettings(!showSettings);

    setShowNotifications(false);

  };

  /* =========================================================
     USER INITIALS
  ========================================================= */

  const getInitials = (name) => {

    if (!name) return "U";

    const names = name.split(" ");

    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }

    return (
      names[0][0] + names[1][0]
    ).toUpperCase();
  };

  return (

    <header className="navbar">

      {/* LEFT SIDE */}

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects, tasks, employees..."
            value={searchQuery || ""}
            onChange={handleSearchChange}
          />

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {/* TIME */}

        <div className="time-box">
          {currentTime}
        </div>

        {/* NOTIFICATIONS */}

        <div className="nav-dropdown-wrapper">

          <button
            className="icon-btns"
            onClick={toggleNotifications}
          >

            <Bell size={20} />

            {notificationCount > 0 && (
              <span className="notification-dot"></span>
            )}

          </button>

          {showNotifications && (

            <div className="dropdown-panel">

              <div className="dropdown-header">

                <h4>Notifications</h4>

                <button
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </button>

              </div>

              {notifications.length > 0 ? (

                notifications.map((item) => (

                  <div
                    key={item.id}
                    className="dropdown-item"
                  >
                    {item.title}
                  </div>

                ))

              ) : (

                <div className="dropdown-empty">
                  No notifications
                </div>

              )}

            </div>

          )}

        </div>

        {/* SETTINGS */}

        <div className="nav-dropdown-wrapper">

          <button
            className="icon-btns"
            onClick={toggleSettings}
          >

            <Settings2 size={20} />

          </button>

          {showSettings && (

            <div className="dropdown-panel settings-panel">

              <div className="dropdown-header">

                <h4>Settings</h4>

                <button
                  className="close-btn"
                  onClick={() => setShowSettings(false)}
                >
                  <X size={16} />
                </button>

              </div>

              <div className="dropdown-item">
                Profile Settings
              </div>

              <div className="dropdown-item">
                Theme Settings
              </div>

              <div className="dropdown-item">
                Security
              </div>

            </div>

          )}

        </div>

        {/* PROFILE */}

        <div className="profile-box">

          <div className="profile-avatar">
            {getInitials(userProfile.name)}
          </div>

          <div className="profile-details">

            <h4>
              {userProfile.name}
            </h4>

            <p>
              {userProfile.role}
            </p>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
          title="Logout"
        >

          <LogOut size={18} />

        </button>

      </div>

    </header>
  );
}