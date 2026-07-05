import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import AIInsights from "./pages/AIInsights";
import Company from "./pages/Company";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />

                <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />

                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />

                <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />

                <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />

                <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />

                <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />

                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
                <Route path="/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;