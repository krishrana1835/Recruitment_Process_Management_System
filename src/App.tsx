import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./tabs/Login";
import Dashboard from "./tabs/CompanyDashboard/Dashboard";
import { AuthProvider } from "./route_protection/AuthContext";
import { ProtectedRoute } from "./route_protection/ProtectedRoute";
// import Unauthorized from "; // Create this page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected company dashboard route */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute requiredRole={["Admin", "HR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
