import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell

} from "recharts";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import API from "../api/api";

export default function Dashboard() {

  const [stats, setStats] = useState({

    employees: 0,
    projects: 0,
    tasks: 0,
    completed: 0,
    pending: 0

  });

  const [isOpen, setIsOpen] = useState(false);

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await API.get(

        "/dashboard-stats",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  // CHART DATA
  const data = [

    {
      name: "Total",
      value: stats.tasks,
      color: "#8B5CF6"
    },

    {
      name: "Pending",
      value: stats.pending,
      color: "#F43F5E"
    },

    {
      name: "Completed",
      value: stats.completed,
      color: "#06B6D4"
    }

  ];

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="main">

        <Navbar />

        <div className="page">

          <h1 className="page-title">

            Enterprise Dashboard

          </h1>

          {/* DASHBOARD CARDS */}

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <span>Total Employees</span>

              <h1>{stats.employees}</h1>

            </div>

            <div className="dashboard-card">

              <span>Total Projects</span>

              <h1>{stats.projects}</h1>

            </div>

            <div className="dashboard-card">

              <span>Pending Tasks</span>

              <h1>{stats.pending}</h1>

            </div>

            <div className="dashboard-card">

              <span>Completed Tasks</span>

              <h1>{stats.completed}</h1>

            </div>

          </div>

          {/* CHART */}

          <div className="chart-box">

            <div className="chart-header">

              <h2>Operational Analytics</h2>

              <p>
                Task workflow overview
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={400}
            >

              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 14
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 14
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  cursor={{
                    fill: "rgba(139,92,246,0.15)"
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                >

                  {data.map((entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}