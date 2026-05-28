import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/api";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    progress: 0
  });

  // =========================================
  // FETCH PROJECTS
  // =========================================

  const fetchProjects = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await API.get(
        "/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchProjects();

  }, []);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "progress"
          ? parseInt(value, 10) || 0
          : value
    });
  };

  // =========================================
  // CREATE PROJECT
  // =========================================

  const createProject = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProjects();

      resetForm();

      alert("Project created successfully!");

    } catch (error) {

      console.error(error);

    }
  };

  // =========================================
  // EDIT PROJECT
  // =========================================

  const handleEdit = (project) => {

    setEditingId(project.id);

    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      progress: project.progress
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================
  // UPDATE PROJECT
  // =========================================

  const updateProject = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/projects/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProjects();

      setEditingId(null);

      resetForm();

      alert("Project updated successfully!");

    } catch (error) {

      console.error(error);

    }
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {

    setFormData({
      name: "",
      description: "",
      status: "Planning",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      progress: 0
    });
  };

  // =========================================
  // DELETE PROJECT
  // =========================================

  const deleteProject = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this project permanently?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await API.delete(
        `/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProjects();

    } catch (error) {

      console.error(error);

    }
  };

  // =========================================
  // STATUS COLORS
  // =========================================

  const getStatusClass = (status) => {

    if (status === "Completed") {
      return "completed";
    }

    if (status === "InProgress") {
      return "in-progress";
    }

    return "planning";
  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="main">

        <Navbar />

        <div className="page">

          {/* HEADER */}

          <div className="projects-header">

            <div>

              <h1 className="page-title">
                Project Management
              </h1>

              <p className="projects-subtitle">
                Track and manage projects
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="project-form-wrapper">

            <div className="form-top">

              <h2>
                {
                  editingId
                    ? "Edit Project"
                    : "Create Project"
                }
              </h2>

            </div>

            <form
              className="project-form"
              onSubmit={
                editingId
                  ? updateProject
                  : createProject
              }
            >

              <div className="form-grid">

                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Planning">
                    Planning
                  </option>

                  <option value="InProgress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="progress"
                  placeholder="Progress %"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />

              </div>

              <button
                type="submit"
                className="submit-project-btn"
              >

                {
                  editingId
                    ? "Update Project"
                    : "Create Project"
                }

              </button>

            </form>

          </div>

          {/* PROJECTS */}

          <div className="projects-grid">

            {projects.map((project) => (

              <div
                className="modern-project-card"
                key={project.id}
              >

                <div className="project-card-top">

                  <div>

                    <h3>{project.name}</h3>

                    <p>{project.description}</p>

                  </div>

                  <span
                    className={`project-status ${getStatusClass(project.status)}`}
                  >

                    {
                      project.status === "InProgress"
                        ? "In Progress"
                        : project.status
                    }

                  </span>

                </div>

                <div className="project-dates">

                  <div>

                    <span>Start</span>

                    <h4>{project.start_date}</h4>

                  </div>

                  <div>

                    <span>End</span>

                    <h4>{project.end_date}</h4>

                  </div>

                </div>

                <div className="progress-section">

                  <div className="progress-top">

                    <span>Progress</span>

                    <strong>
                      {project.progress}%
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.progress}%`
                      }}
                    />

                  </div>

                </div>

                <div className="project-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(project)
                    }
                  >

                    Edit

                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProject(project.id)
                    }
                  >

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}