import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./tabs/Authentication/Login";
import Dashboard from "./tabs/CompanyDashboard/Dashboard";
import Unauthorized from "./tabs/Authentication/Unauthorized";
import { AuthProvider } from "./route_protection/AuthContext";
import { ProtectedRoute } from "./route_protection/ProtectedRoute";
import UserManage from "./tabs/CompanyDashboard/Admin/UserManage";
import UserProfile from "./tabs/CompanyDashboard/Admin/UserProfileView";
import AddUser from "./components/custom/AddUser";
import DeleteHandler from "./components/custom/DeleteHandler";
import Logout from "./route_protection/Logout"; // Import the new Logout component

/**
 * Main application component that sets up routing and authentication.
 * It uses React Router for navigation and AuthProvider for managing authentication state.
 */
function App() {
  return (
    <AuthProvider> {/* Provides authentication context to the entire application */}
      <Router> {/* Enables client-side routing */}
        <Routes> {/* Defines the application's routes */}
          <Route path="/" element={<Login />} /> {/* Route for the login page */}
          <Route path="/unauthorized" element={<Unauthorized />} /> {/* Route for unauthorized access */}
          <Route path="/logout" element={<Logout />} /> {/* Route for logging out */}

          {/* Protected route for the company dashboard and its sub-routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute requiredRole={["Admin", "HR"]}> {/* Only Admin and HR roles can access the dashboard */}
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested routes within the dashboard */}
            <Route
              index
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* Default dashboard view for Admin */}
                  <UserManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* User management page for Admin */}
                  <UserManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/profile/view/:id"
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* View user profile page for Admin */}
                  <UserProfile allowUpdate={false} />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/profile/update/:id"
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* Update user profile page for Admin */}
                  <UserProfile allowUpdate={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/add"
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* Add new user page for Admin */}
                  <AddUser/>
                </ProtectedRoute>
              }
            />
            <Route
              path=":deleteapi/delete/:deleteid"
              element={
                <ProtectedRoute requiredRole={["Admin"]}> {/* Generic delete handler for Admin */}
                  <DeleteHandler/>
                </ProtectedRoute>
              }
            />
            {/* Add more nested routes here as needed */}
          </Route>

          {/* Optional: handle unknown routes by redirecting to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
