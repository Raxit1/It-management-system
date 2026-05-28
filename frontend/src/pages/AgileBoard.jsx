import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../api/api";

function AgileBoard() {

    const [tasks, setTasks] =
        useState([]);

    useEffect(() => {

        fetchTasks();

    }, []);

    const fetchTasks = async () => {

        try {

            const res =
                await API.get("/tasks");

            setTasks(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            await API.put(
                `/tasks/${id}`,
                { status }
            );

            fetchTasks();

        } catch (error) {

            console.log(error);
        }
    };

    const renderTasks = (status) => {

        return tasks
            .filter(
                (task) =>
                    task.status === status
            )
            .map((task) => (

                <div
                    key={task.id}
                    className="task-card"
                >

                    <h3>
                        {task.title}
                    </h3>

                    <p>
                        {task.description}
                    </p>

                    <select
                        value={task.status}
                        onChange={(e) =>
                            updateStatus(
                                task.id,
                                e.target.value
                            )
                        }
                    >

                        <option>
                            Pending
                        </option>

                        <option>
                            In Progress
                        </option>

                        <option>
                            Completed
                        </option>

                    </select>

                </div>
            ));
    };

    return (

        <Layout>

            <h1 className="page-title">
                Agile Task Board
            </h1>

            <div className="board">

                <div className="board-column">

                    <h2>
                        Pending
                    </h2>

                    {renderTasks("Pending")}

                </div>

                <div className="board-column">

                    <h2>
                        In Progress
                    </h2>

                    {renderTasks("In Progress")}

                </div>

                <div className="board-column">

                    <h2>
                        Completed
                    </h2>

                    {renderTasks("Completed")}

                </div>

            </div>

        </Layout>
    );
}

export default AgileBoard;