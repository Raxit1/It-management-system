import { useEffect, useState } from "react";

import API from "../api/api";

import Layout from "../components/Layout";

export default function Tasks() {

    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({

        title: "",
        description: "",
        status: "",
        employee_id: "",
        project_id: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        fetchTasks();

    }, []);

    const fetchTasks = async () => {

        try {

            const res = await API.get("/tasks");

            setTasks(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await API.put(

                    `/tasks/${editingId}`,

                    formData
                );

            } else {

                await API.post(
                    "/tasks",
                    formData
                );
            }

            fetchTasks();

            setEditingId(null);

            setFormData({

                title: "",
                description: "",
                status: "",
                employee_id: "",
                project_id: ""
            });

        } catch (error) {

            console.log(error);
        }
    };

    const deleteTask = async (id) => {

        try {

            await API.delete(`/tasks/${id}`);

            fetchTasks();

        } catch (error) {

            console.log(error);
        }
    };

    const editTask = (task) => {

        setFormData({

            title: task.title,
            description: task.description,
            status: task.status,
            employee_id: task.employee_id,
            project_id: task.project_id
        });

        setEditingId(task.id);
    };

    return (

        <Layout>

            <h1 className="page-title">
                Tasks
            </h1>

            <form
                onSubmit={handleSubmit}
                className="form-container"
            >

                <div className="form-grid">

                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        value={formData.status}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="employee_id"
                        placeholder="Employee ID"
                        value={formData.employee_id}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="project_id"
                        placeholder="Project ID"
                        value={formData.project_id}
                        onChange={handleChange}
                    />

                </div>

                <button
                    type="submit"
                    className="btn btn-add"
                >
                    {editingId
                        ? "Update Task"
                        : "Add Task"}
                </button>

            </form>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Title</th>

                        <th>Status</th>

                        <th>Employee</th>

                        <th>Project</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {tasks.map((task) => (

                        <tr key={task.id}>

                            <td>{task.id}</td>

                            <td>{task.title}</td>

                            <td>

                                <span
                                    className={`status ${
                                        task.status === "Completed"
                                            ? "completed"
                                            : task.status === "Pending"
                                            ? "pending"
                                            : "inprogress"
                                    }`}
                                >
                                    {task.status}
                                </span>

                            </td>

                            <td>
                                {task.employee_id}
                            </td>

                            <td>
                                {task.project_id}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        editTask(task)
                                    }
                                    className="btn btn-edit"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteTask(task.id)
                                    }
                                    className="btn btn-delete"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </Layout>
    );
}