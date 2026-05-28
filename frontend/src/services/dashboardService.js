import API from "../api/api";

export const getDashboard = async () => {

    const response = await API.get("/dashboard");

    return response.data;
};

export const getTaskAnalytics = async () => {

    const response = await API.get("/task-analytics");

    return response.data;
};