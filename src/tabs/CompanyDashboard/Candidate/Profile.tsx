import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { getCandidateDashProfile, UpdateCandidateDashProfile } from "@/api/Candidate_api";

export interface CandidateDashboardProfileData {
  candidate_id: string;
  full_name: string;
  email: string;
  phone: string;
}

export default function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateDashboardProfileData>({
    candidate_id: user?.userId || "",
    full_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {

    const fetchData = async () => {
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
            const response = await getCandidateDashProfile(user.userId, user.token); 
            setProfile(response);
        } catch (error: any) {
            notify.error(error.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleUpdate = async () => {
    setSuccess("");
    if(!user?.token){
        notify.error("User token not found.");
        return;
    }
    try {
      setLoading(true);
      const response =await UpdateCandidateDashProfile(profile, user?.email, user?.token);
      setProfile(response);
      setSuccess("Profile updated successfully!");
      notify.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      notify.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 h-full p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-lg bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-black text-center sm:text-left">
            Candidate Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <Input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={handleChange}
              className="border-gray-300 focus:border-black focus:ring-0 bg-white text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className="border-gray-300 focus:border-black focus:ring-0 bg-white text-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <Input
              id="phone"
              type="text"
              value={profile.phone}
              onChange={handleChange}
              className="border-gray-300 focus:border-black focus:ring-0 bg-white text-black"
            />
          </div>

          {success && (
            <p className="text-green-600 text-sm text-center mt-2">{success}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
