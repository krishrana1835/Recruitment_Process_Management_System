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
 * Login component for user authentication.
 * Allows users to enter their email, password, and select a role to log in.
 * Handles authentication, stores user data, and redirects upon successful login.
 */
export default function Login() {
  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // State to store available roles fetched from the API
  const [rolesData, setRolesData] = useState<RoleDto[]>([]);
  // State for displaying error messages
  const [error, setError] = useState<null | string>(null);
  // Authentication context to set user information globally
  const { setUser } = useAuth();
  // Navigation hook for programmatic redirection
  const navigate = useNavigate();

  // Effect hook to fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await getRoles();
        setRolesData(result);
      } catch (error: any) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Type guard to check if a given string is a valid UserRole.
   * @param {any} role - The role string to check.
   * @returns {boolean} True if the role is a valid UserRole, false otherwise.
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
   * Handles the login form submission.
   * Prevents default form submission, validates inputs, calls the login API,
   * updates authentication context, stores user data, and redirects.
   * @param {React.FormEvent} e - The form event.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear any previous errors

    // Validate if all fields are filled
    if (!email || !password || !role) {
      setError("Please fill all fields.");
      return;
    }

    try {
      // Call the login API with provided credentials
      const result = await loginUser({ email, password, role });

      // Prepare user data for the authentication context and local storage
      const userdata = {
        isAuthenticated: true,
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        role: isUserRole(result.user.role) ? result.user.role : "Viewer", // Ensure the role is a valid UserRole
      };
      // Update the authentication context with the logged-in user's data
      setUser(userdata);

      // Save user data to localStorage (consider sessionStorage for better security for tokens)
      localStorage.setItem("user", JSON.stringify(userdata));

      // Redirect to the company dashboard upon successful login
      navigate(`/company/dashboard`);
    } catch (error: any) {
      // Display error message if login fails
      setError(error?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}> {/* Form for handling login */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl"> {/* Login card container */}
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1> {/* Login form title */}

            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="role" className="mb-2 block">
                Select Role
              </Label>
              <Select onValueChange={(val) => setRole(val)}> {/* Dropdown for role selection */}
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData.map((r) => (
                    <SelectItem
                      key={r.role_id}
                      value={r.role_name}
                    >
                      {r.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Display error message if present */}

            <Button className="w-full cursor-pointer" type="submit">
              Sign In
            </Button>

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