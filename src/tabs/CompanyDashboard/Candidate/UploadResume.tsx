import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { deleteCandidateResume, uploadResume } from "@/api/UploadFiles_api";
import { getCandidateResume, uploadResumeCandidate } from "@/api/Candidate_api";
import { Atom } from "react-loading-indicators";

const document_url = import.meta.env.VITE_DOCUMENT_URL;

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resumePath, setResumePath] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const loadCandidateResume = async () => {
      setLoading(true);
      if (!user) {
        notify.error("User not authenticated.");
        setLoading(false);
        return;
      }
      if (!user.token) {
        notify.error("User token not found.");
        setLoading(false);
        return;
      }
      try {
        const data = await getCandidateResume(user?.userId, user.token);
        // Handle the loaded resume data as needed
        if (data.success) {
          setResumePath(data.resume_path || null);
        }
      } catch (error: any) {
        notify.error(error.message || "Failed to load resume.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      loadCandidateResume();
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      notify.error("Please select a resume file first.");
      return;
    }
    if (!user || !user.token) {
      notify.error("You must be logged in to upload a resume.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress (for visual feedback)
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      if (resumePath) {
        const response = await deleteCandidateResume(resumePath, user.token);
        if (!response.success) {
          throw new Error("Failed to delete existing resume.");
        }
      }

      const response = await uploadResume(file, user.token);
      const resumeUrl = response.url;
      const id = user?.userId;
      const candidateresponse = await uploadResumeCandidate(
        { candidate_id: id, resume_path: resumeUrl },
        user?.token
      );
      setResumePath(candidateresponse.url);
      clearInterval(progressInterval);
      setProgress(100);

      notify.success("Resume uploaded successfully!");
      setFile(null);
    } catch (error: any) {
      notify.error(error.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
      <Card className="w-full max-w-lg border border-gray-200 shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your most recent resume (PDF or DOCX format).
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Select Resume File</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Label>Uploading...</Label>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </Button>

          {resumePath && (
            <a
              href={document_url + resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center bg-gray-600 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              View Resume
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
