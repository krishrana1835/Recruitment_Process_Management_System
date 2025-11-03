import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { ResetCandidatePasswordDto } from "@/interfaces/Candidate_interface";
import { useAuth } from "@/route_protection/AuthContext";
import { resetCandidatePassword } from "@/api/Candidate_api";
import { notify } from "@/components/custom/Notifications";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

export default function ResetPassword() {
  const [formData, setFormData] = useState<ResetCandidatePasswordDto>({
    candidate_id: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, candidate_id: user.userId }));
    }
  }, [user]);

  // Assume API function exists elsewhere
  // const resetCandidatePassword = async (dto: ResetCandidatePasswordDto) => { ... }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8–16 characters, include uppercase, lowercase, a number, and a special character.";
    }

    if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    setSuccess("");
    if (!validate()) return;

    if(!user){
        notify.error("User not authenticated.");
        return;
    }
    if(!user.token){
        notify.error("User token not found.");
        return;
    }
    try {
      setLoading(true);
      const response = await resetCandidatePassword(formData, user?.token);
      if(response.success){
        setSuccess("Password has been reset successfully.");
        notify.success("Password has been reset successfully.");
      }
    } catch (err: any) {
      setErrors({ password: err.message || "Failed to reset password." });
      notify.error(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-50">
      <Card className="w-full max-w-md border border-gray-200 shadow-sm bg-white text-black">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-black">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter and confirm your new password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-black focus:ring-0 bg-white text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-gray-300 focus:border-black focus:ring-0 bg-white text-black"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {success && (
            <p className="text-green-600 text-sm text-center mt-2">
              {success}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}