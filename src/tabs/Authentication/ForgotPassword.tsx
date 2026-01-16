import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GenerateOtp,
  ResetPassword,
  VerifyOtp,
} from "@/api/EmailVerification_api";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateOtp = async () => {
    if (isLoading || !email) return;

    setIsLoading(true);
    try {
      await GenerateOtp({ identifier: email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isLoading || !otp) return;

    setIsLoading(true);
    try {
      const res = await VerifyOtp({ identifier: email, otp });
      setResetToken(res.resetToken);
      toast.success("OTP verified");
      setStep(3);
    } catch (err: any) {
      toast.error(err?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors: typeof errors = {};

    if (!passwordRegex.test(newPassword)) {
      newErrors.password =
        "Password must be 8–16 characters, include uppercase, lowercase, number, and special character.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (isLoading) return;

    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await ResetPassword({
        identifier: email,
        resetToken,
        newPassword,
      });

      toast.success("Password reset successful");

      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-center">
                Enter Your Email
              </h2>

              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Button
                className="w-full"
                onClick={handleGenerateOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-center">
                Verify OTP
              </h2>

              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
              />

              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-center">
                Reset Password
              </h2>

              <div>
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}