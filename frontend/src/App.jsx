import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard, { ProtectedUser } from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Clients from "./pages/Clients";
import Estimator from "./pages/Estimator";
import RiskPrediction from "./pages/RiskPrediction";
import Teams from "./pages/Teams";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications"; // 1. Safe Import
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Secure Architecture Core Enclaves */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                <Route path="/estimator" element={<ProtectedRoute><Estimator /></ProtectedRoute>} />
                <Route path="/risk" element={<ProtectedRoute><RiskPrediction /></ProtectedRoute>} />
                <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                
                {/* 2. Registered Real-Time Notifications Center Route */}
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;