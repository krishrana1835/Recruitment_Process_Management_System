import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/custom/Notifications";
import { sendOtp, verifyOtp } from "@/api/EmailVerification_api";
import { getLastCandidateId, registerCandidate } from "@/api/Candidate_api";
import type { RegisterCandidateDto } from "@/interfaces/Candidate_interface";
import { useNavigate } from "react-router-dom";

const CandidateRegistration = () => {

    const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterCandidateDto>({
    candidate_id: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Input validation
  const validateInputs = () => {
    const newErrors: any = {};

    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

    if (!nameRegex.test(formData.full_name))
      newErrors.full_name = "Enter a valid full name (3–50 letters).";

    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";

    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be 8–16 chars with upper, lower, number & special char.";

    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit registration (send OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const result = await sendOtp(formData.email);
      if (result.success) {
        notify.info("OTP Sent", `An OTP was sent to ${formData.email}`);
        setStep("otp");
      } else {
        notify.error("Error", "Failed to send OTP");
      }
    } catch(error: any) {
      notify.error("Error", error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.trim().length === 0) {
      notify.warning("Missing OTP", "Please enter your OTP");
      return;
    }

    setLoading(true);
    try {
      const verify = await verifyOtp(formData.email, otp);
      if (verify.verified) {
        notify.success("OTP Verified", "Your email has been verified.");
        const lastId = await getLastCandidateId("");
        formData.candidate_id = `CAND${(parseInt(lastId.slice(4)) + 1)
          .toString()
          .padStart(4, "0")}`;
        const insert = await registerCandidate(formData);
        if (insert.success) {
          notify.success("Success", "Registration completed successfully!");
          setStep("form");
          setFormData({
            candidate_id: "",
            full_name: "",
            email: "",
            phone: "",
            password: "",
          });
          setOtp("");
        }
      } else {
        notify.error("Invalid OTP", "The OTP you entered is incorrect.");
      }
    } catch(error: any) {
      notify.error("Error", error?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Candidate Registration
        </h2>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
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
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 text-white hover:bg-gray-700"
            >
              {loading ? "Sending OTP..." : "Register"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              We sent a 6-digit OTP to your email <b>{formData.email}</b>.
              Please enter it below.
            </p>

            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-widest"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 text-white hover:bg-gray-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
              className="w-full"
            >
              Go Back
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Log in
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default CandidateRegistration;
