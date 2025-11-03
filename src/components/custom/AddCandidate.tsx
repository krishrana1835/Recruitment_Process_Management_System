import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { createCandidate, getLastCandidateId } from "@/api/Candidate_api";
import { generateRandomPassword } from "./PasswordGenerator";
import type { CreateCandidateDto } from "@/interfaces/Candidate_interface";
import { uploadResume } from "@/api/UploadFiles_api";
import { notify } from "./Notifications";

/**
 * @interface LastId
 * @description Represents the last candidate ID received from the API.
 */
export interface LastId {
  candidate_id: string | null;
}

/**
 * @component AddCandidate
 * @description A component for creating new candidates, including a resume upload.
 * @returns {JSX.Element} The AddCandidate component.
 */
const AddCandidate = () => {
  // State for holding the new candidate's data.
  const [candidateData, setCandidateData] = useState({
    candidate_id: "",
    full_name: "",
    phone: "",
    email: "",
  });
  // State specifically for the resume file.
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // State for error handling and loading indicators.
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get user authentication context.
  const { user } = useAuth();

  /**
   * Fetches the next available candidate ID on component mount.
   */
  useEffect(() => {
    const getNextCandidateId = async () => {
      try {
        if (!user?.token) {
          throw new Error("No authentication token found.");
        }

        const lastId = await getLastCandidateId(user.token);

        if (!lastId || !lastId.startsWith("CAND")) {
          // Fallback if no valid ID is returned
          setCandidateData((prev) => ({ ...prev, candidate_id: "CAND0001" }));
          return;
        }

        const numberPart = parseInt(lastId.slice(4), 10);

        if (isNaN(numberPart)) {
          throw new Error("Invalid candidate ID number.");
        }

        const nextNumber = numberPart + 1;
        const nextId = `CAND${nextNumber.toString().padStart(4, "0")}`;

        setCandidateData((prev) => ({ ...prev, candidate_id: nextId }));
      } catch (err: any) {
        setError(err.message || "Failed to fetch next candidate ID.");
      } finally {
        setLoading(false);
      }
    };

    getNextCandidateId();
  }, [user]);

  /**
   * Handles changes in form input fields.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [id]: value }));
  };

  /**
   * Handles the selection of a resume file.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  /**
   * Handles the form submission to create a new candidate.
   */
  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);

  if (
    !candidateData.full_name ||
    !candidateData.email ||
    !candidateData.phone
  ) {
    setError("Please fill out all required fields.");
    return;
  }

  if (!resumeFile) {
    setError("Please upload a resume file.");
    return;
  }

  if (!user?.token) {
    setError("Authentication error. Please log in again.");
    return;
  }

  setLoading(true);



  try {
    // 1. Upload resume via API wrapper
    const resume_path = await uploadResume(resumeFile, user.token);

    // 2. Construct CreateCandidateDto
    const newCandidate: CreateCandidateDto = {
      candidate_id: candidateData.candidate_id,
      full_name: candidateData.full_name,
      email: candidateData.email,
      phone: candidateData.phone,
      resume_path: resume_path.url || "",
      password: generateRandomPassword(),
    };

    // 3. Call your API wrapper
    await createCandidate(newCandidate,user.token);

    notify.success("Success","Candidate created successfully!");
    // Reset form if needed
  } catch (error: any) {
    setError(error.message || "An unknown error occurred.");
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <Card className="bg-white text-gray-800 font-sans border-none shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Add New Candidate
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="candidate_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Candidate ID
                </label>
                <input
                  type="text"
                  id="candidate_id"
                  className="border block w-full bg-gray-100 border-gray-300 rounded-md text-gray-500 sm:text-sm h-10 px-3"
                  value={candidateData.candidate_id}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={candidateData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={candidateData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={candidateData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-100 file:text-gray-700
                    hover:file:bg-gray-200 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  PDF, DOC, DOCX (Max size: 5MB)
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                variant="outline"
                className="bg-gray-500 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Candidate"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default AddCandidate;
