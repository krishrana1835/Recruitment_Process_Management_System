import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./tabs/Authentication/Login";
import Dashboard from "./tabs/CompanyDashboard/Dashboard";
import Unauthorized from "./tabs/Authentication/Unauthorized";
import { AuthProvider } from "./route_protection/AuthContext";
import { ProtectedRoute } from "./route_protection/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute requiredRole={["Admin", "HR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Optional: handle unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;