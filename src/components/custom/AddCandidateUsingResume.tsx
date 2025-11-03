import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/route_protection/AuthContext";

import { createCandidate, getLastCandidateId } from "@/api/Candidate_api";
import { analizeResume, uploadResume } from "@/api/UploadFiles_api";
import { generateRandomPassword } from "./PasswordGenerator";
import type { CreateCandidateDto } from "@/interfaces/Candidate_interface";
import { getSkills, assignSkillsToCandidate } from "@/api/Skill_api";
import type { SkillDto } from "@/interfaces/Skill_interrface";
import { notify } from "./Notifications";

/**
 * @component AddCandidateUsingResume
 * @description Component for adding a new candidate and assigning skills separately.
 */
const AddCandidateUsingResume = () => {
  const [candidateData, setCandidateData] = useState({
    candidate_id: "",
    full_name: "",
    phone: "",
    email: "",
  });

  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableSkills, setAvailableSkills] = useState<SkillDto[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!user?.token) throw new Error("No authentication token found.");

        // Fetch next candidate ID
        const lastId = await getLastCandidateId(user.token);
        const nextId =
          !lastId || !lastId.startsWith("CAND")
            ? "CAND0001"
            : `CAND${(parseInt(lastId.slice(4), 10) + 1)
                .toString()
                .padStart(4, "0")}`;

        setCandidateData((prev) => ({ ...prev, candidate_id: nextId }));

        const skillsList = await getSkills();
        if (skillsList.length > 0) setAvailableSkills(skillsList);
      } catch (err: any) {
        setError(err.message || "Failed to fetch initial data.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [id]: value }));
  };

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleResumeAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) return setError("No file selected.");
    if (!user?.token) return setError("User is not authorized");

    setLoading(true);
    try {
      const result = await analizeResume(resumeFile, user.token);

      setCandidateData((prev) => ({
        ...prev,
        full_name: result.name || prev.full_name,
        email: result.email || prev.email,
        phone: result.phone || prev.phone,
      }));

      if (result.skills && Array.isArray(result.skills)) {
        const matchedSkills = availableSkills.filter((skill) =>
          result.skills.some(
            (extracted: string) =>
              extracted.toLowerCase() === skill.skill_name.toLowerCase()
          )
        );

        // Store selected skills (with ID + name)
        setSkills(matchedSkills);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skillObj: SkillDto) => {
    if (!skills.some((s) => s.skill_id === skillObj.skill_id)) {
      setSkills((prev) => [...prev, skillObj]);
    }
    setSkillInput("");
  };

  const removeSkill = (skillId: number) => {
    setSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
  };

  const filteredSkills = availableSkills.filter(
    (s) =>
      s.skill_name.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.some((selected) => selected.skill_id === s.skill_id)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const { full_name, email, phone } = candidateData;
    if (!full_name || !email || !phone) {
      return setError("Please fill out all required fields.");
    }
    if (!resumeFile) return setError("Please upload a resume file.");
    if (!user?.token)
      return setError("Authentication error. Please log in again.");

    setLoading(true);

    try {
      // 1. Upload resume
      const resume_path = await uploadResume(resumeFile, user.token);

      // 2. Create candidate
      const newCandidate: CreateCandidateDto = {
        candidate_id: candidateData.candidate_id,
        full_name,
        email,
        phone,
        resume_path: resume_path.url || "",
        password: generateRandomPassword(),
      };

      await createCandidate(newCandidate,user.token);

      // 3. Assign skills separately if selected
      if (skills.length > 0) {
        const skillIds = skills.map((s) => s.skill_id);
        await assignSkillsToCandidate(
          candidateData.candidate_id,
          skillIds,
          user.token
        );
      }

      notify.success("Success","Candidate created successfully!");
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

          <form onSubmit={handleResumeAnalyze} className="mb-6">
            <Input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={handleResumeChange}
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded text-sm mt-3"
              type="submit"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {/* ================= Candidate Form ================= */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate ID */}
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

              {/* Full name */}
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
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                  value={candidateData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Phone */}
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
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                  value={candidateData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
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
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                  value={candidateData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="flex items-center bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill.skill_name}
                      <div
                        className="ml-2 cursor-pointer"
                        onClick={() => removeSkill(skill.skill_id)}
                      >
                        X
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type and select skill"
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                  {skillInput && filteredSkills.length > 0 && (
                    <div className="absolute z-10 bg-purple-50 border border-purple-200 w-full mt-1 rounded-md max-h-40 overflow-y-auto shadow-sm">
                      {filteredSkills.map((s) => (
                        <div
                          key={s.skill_id}
                          onClick={() => addSkill(s)}
                          className="px-3 py-2 hover:bg-purple-100 cursor-pointer text-purple-900"
                        >
                          {s.skill_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Resume */}
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                  onChange={handleResumeChange}
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

export default AddCandidateUsingResume;
