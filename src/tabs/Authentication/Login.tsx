import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { loginUser } from "@/api/Auth_api";
import { getRoles } from "@/api/Roles_api";
import type { RoleDto } from "@/interfaces/Roles_interface";
import { useAuth, type UserRole } from "@/route_protection/AuthContext";

/**
 * Login Component for user authentication.
 *
 * This component provides a form for users to log in to the application. It includes:
 * - Email input field
 * - Password input field
 * - Role selection dropdown
 * - Login button
 * - Validation for input fields (email, password, and role)
 * - Error handling for invalid login credentials or failed API requests
 * - Redirects the user to the company dashboard upon successful login.
 *
 * @component
 */
export default function Login() {
  const [email, setEmail] = useState(""); // User email state
  const [password, setPassword] = useState(""); // User password state
  const [role, setRole] = useState(""); // User role state
  const [rolesData, setRolesData] = useState<RoleDto[]>([]); // Available roles data
  const [error, setError] = useState<null | string>(null); // Error message state
  const { setUser } = useAuth(); // Custom hook for user authentication context
  const navigate = useNavigate(); // React Router's useNavigate for redirection

  /**
   * Fetch roles from the API on component mount.
   *
   * This function makes an API call to fetch available roles for the user.
   * The roles are then used to populate the role selection dropdown.
   *
   * @async
   * @function
   */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await getRoles();
        setRolesData(result); // Update roles state with fetched data
      } catch (error: any) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles(); // Call fetchRoles function when the component mounts
  }, []);

  /**
   * Type guard to check if a given role is a valid user role.
   *
   * @param {any} role - The role to validate.
   * @returns {role is UserRole} - Returns true if the role is a valid UserRole.
   */
  const isUserRole = (role: any): role is UserRole => {
    return [
      "Recruiter",
      "HR",
      "Interviewer",
      "Reviewer",
      "Admin",
      "Candidate",
      "Viewer",
    ].includes(role);
  };

  /**
   * Validate the format of the email address.
   *
   * @param {string} email - The email string to validate.
   * @returns {boolean} - Returns true if the email matches a valid format.
   */
  const validateEmail = (email: string) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(email);
  };

  /**
   * Validate the password strength.
   *
   * @param {string} password - The password string to validate.
   * @returns {boolean} - Returns true if the password is at least 6 characters long.
   */
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  /**
   * Handle the form submission for login.
   *
   * This function is triggered when the user submits the login form.
   * It validates the email, password, and role, and makes an API request to log the user in.
   * If the login is successful, the user is redirected to the company dashboard.
   * If the login fails, an error message is displayed.
   *
   * @param {React.FormEvent} e - The form submit event.
   * @returns {void}
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submit behavior
    setError(null); // Clear any previous errors

    // Basic validation for email, password, and role
    if (!email || !password || !role) {
      setError("Please fill all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      // Attempt to log in using the provided credentials
      const result = await loginUser({ email, password, role });

      // Prepare user data for authentication context and local storage
      const userdata = {
        isAuthenticated: true,
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        role: isUserRole(result.user.role) ? result.user.role : "Viewer",
      };

      setUser(userdata); // Set user data in the authentication context
      localStorage.setItem("user", JSON.stringify(userdata)); // Save user data to localStorage

      navigate(`/company/dashboard`); // Redirect to the company dashboard
    } catch (error: any) {
      // Handle any errors during login
      setError(error?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            {/* Email input field */}
            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password input field */}
            <div className="mb-4">
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role selection dropdown */}
            <div className="mb-6">
              <Label htmlFor="role" className="mb-2 block">
                Select Role
              </Label>
              <Select onValueChange={(val) => setRole(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData.map((r) => (
                    <SelectItem key={r.role_id} value={r.role_name}>
                      {r.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error message display */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Submit button */}
            <Button className="w-full cursor-pointer" type="submit">
              Sign In
            </Button>

            {/* Register link */}
            <div className="text-sm text-center mt-4">
              <p>
                Don&apos;t have an account?
                <Link
                  to="/auth/register"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
