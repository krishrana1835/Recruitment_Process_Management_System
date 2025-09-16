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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rolesData, setRolesData] = useState<RoleDto[]>([]);
  const [error, setError] = useState<null | string>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
  }, []);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !role) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const result = await loginUser({ email, password, role });

      const userdata = {
        isAuthenticated: true,
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        role: isUserRole(result.user.role) ? result.user.role : "Viewer",
      };
      // Update context
      setUser(userdata);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userdata));

      // Optional: Redirect based on role
      navigate(`/company/dashboard`);
    } catch (error: any) {
      setError(error?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

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
