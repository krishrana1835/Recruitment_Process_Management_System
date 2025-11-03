"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import type { SkillDto } from "@/interfaces/Skill_interrface";
import { getSkills } from "@/api/Skill_api";
import { createJob, getJob, updateJob } from "@/api/Job_api";
import type {
  CreateNewJobDto,
  UpdateJobDto,
} from "@/interfaces/Jobs_interface";
import { notify } from "./Notifications";
import { useParams } from "react-router-dom";

interface Action {
  action: "Update" | "Insert" | "View";
}

const AddJob = ({ action }: Action) => {
  const { user } = useAuth();

  const job_id = useParams().id;

  const [jobData, setJobData] = useState<CreateNewJobDto>({
    job_title: "",
    job_description: "",
    created_by: user?.userId || "",
    status: {
      status: "Open",
      reason: "",
      changed_by: user?.userId || "",
    },
    jobs_Skills: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [requiredSkills, setRequiredSkills] = useState<SkillDto[]>([]);
  const [requiredSkillInput, setRequiredSkillInput] = useState("");

  const [preferredSkills, setPreferredSkills] = useState<SkillDto[]>([]);
  const [preferredSkillInput, setPreferredSkillInput] = useState("");

  const [availableSkills, setAvailableSkills] = useState<SkillDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      if (!user?.token) {
        setError("No token found.");
        setLoading(false);
        return;
      }

      try {
        // Fetch available skills first
        const skillsList = await getSkills();
        if (skillsList?.length > 0) {
          setAvailableSkills(skillsList);
        }

        // Only fetch job details if Update or View mode
        if ((action === "Update" || action === "View") && job_id != null) {
          const response = await getJob(job_id, user.token);

          // Set job data
          setJobData({
            job_title: response.job_title,
            job_description: response.job_description,
            created_by: response.created_by,
            status: {
              status: response.status.status,
              reason: response.status.reason,
              changed_by: response.status.changed_by,
            },
            jobs_Skills: response.jobs_Skills.map((skill: any) => ({
              skill_ids: skill.skill_ids,
              skill_type: skill.skill_type,
            })),
          });

          // Separate skills into required and preferred
          const requiredSkillsResponse = response.jobs_Skills.filter(
            (skill: any) => skill.skill_type === "R"
          );
          const preferredSkillsResponse = response.jobs_Skills.filter(
            (skill: any) => skill.skill_type === "P"
          );

          // ✅ Use skillsList directly instead of availableSkills
          const rskills = skillsList.filter((skill: any) =>
            requiredSkillsResponse.some(
              (rs: any) => rs.skill_ids === skill.skill_id
            )
          );
          const pskills = skillsList.filter((skill: any) =>
            preferredSkillsResponse.some(
              (rs: any) => rs.skill_ids === skill.skill_id
            )
          );

          setRequiredSkills(rskills);
          setPreferredSkills(pskills);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch job or skill data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [action, job_id, user?.token]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!user || !user.token) {
      setError("No authenticated user or token.");
      setLoading(false);
      return;
    }
    if (!jobData.job_title || !jobData.job_description) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Prepare jobs_Skills array
      const jobSkillsPayload = [
        ...requiredSkills.map((s) => ({
          job_id: 0, // backend will set this after job is created
          skill_ids: s.skill_id,
          skill_type: "Required",
        })),
        ...preferredSkills.map((s) => ({
          job_id: 0,
          skill_ids: s.skill_id,
          skill_type: "Preferred",
        })),
      ];

      const payload: CreateNewJobDto = {
        ...jobData,
        created_by: user.userId,
        status: {
          ...jobData.status,
          changed_by: user.userId,
        },
        jobs_Skills: jobSkillsPayload,
      };

      if (action === "Insert") {
        await createJob(payload, user.token);

        notify.success("Success", "Job created successfully!");
        setJobData({
          job_title: "",
          job_description: "",
          created_by: user.userId,
          status: { status: "Open", reason: "", changed_by: user.userId },
          jobs_Skills: [],
        });
        setRequiredSkills([]);
        setPreferredSkills([]);
      } else if (action === "Update" && job_id != null) {
        const updateJobdata: UpdateJobDto = {
          ...payload,
          job_id: parseInt(job_id),
        };
        const response = await updateJob(updateJobdata, user.token);
        notify.success("Success", "Job updated successfully!");

        // Set job data
        setJobData({
          job_title: response.job_title,
          job_description: response.job_description,
          created_by: response.created_by,
          status: {
            status: response.status.status,
            reason: response.status.reason,
            changed_by: response.status.changed_by,
          },
          jobs_Skills: response.jobs_Skills.map((skill: any) => ({
            skill_ids: skill.skill_ids,
            skill_type: skill.skill_type,
          })),
        });

        // Separate skills into required and preferred
        const requiredSkillsResponse = response.jobs_Skills.filter(
          (skill: any) => skill.skill_type === "Required"
        );
        const preferredSkillsResponse = response.jobs_Skills.filter(
          (skill: any) => skill.skill_type === "Preferred"
        );

        // ✅ Use skillsList directly instead of availableSkills
        const rskills = availableSkills.filter((skill: any) =>
          requiredSkillsResponse.some(
            (rs: any) => rs.skill_ids === skill.skill_id
          )
        );
        const pskills = availableSkills.filter((skill: any) =>
          preferredSkillsResponse.some(
            (rs: any) => rs.skill_ids === skill.skill_id
          )
        );

        setRequiredSkills(rskills);
        setPreferredSkills(pskills);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create job");
      notify.error("Error", "Faild to create job.");
    } finally {
      setLoading(false);
    }
  };

  // 🛠 Add or Remove Skills
  const addRequiredSkill = (skillObj: SkillDto) => {
    if (!requiredSkills.some((s) => s.skill_id === skillObj.skill_id)) {
      setRequiredSkills((prev) => [...prev, skillObj]);
    }
    setRequiredSkillInput("");
  };

  const addPreferredSkill = (skillObj: SkillDto) => {
    if (!preferredSkills.some((s) => s.skill_id === skillObj.skill_id)) {
      setPreferredSkills((prev) => [...prev, skillObj]);
    }
    setPreferredSkillInput("");
  };

  const removeRequiredSkill = (skillId: number) => {
    setRequiredSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
  };

  const removePreferredSkill = (skillId: number) => {
    setPreferredSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
  };

  const filteredRequiredSkills = availableSkills.filter(
    (s) =>
      s.skill_name.toLowerCase().includes(requiredSkillInput.toLowerCase()) &&
      !requiredSkills.some((selected) => selected.skill_id === s.skill_id)
  );

  const filteredPreferredSkills = availableSkills.filter(
    (s) =>
      s.skill_name.toLowerCase().includes(preferredSkillInput.toLowerCase()) &&
      !preferredSkills.some((selected) => selected.skill_id === s.skill_id)
  );

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." />
      </Card>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500 font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="bg-white text-gray-800 font-sans border border-gray-200 shadow-lg">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
          {action === "Insert"
            ? "Create New"
            : action === "Update"
            ? "Update"
            : "View"}{" "}
          Job
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-8"
        >
          {/* Job Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Job Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                  type="text"
                  id="job-title"
                  className="h-11"
                  value={jobData.job_title}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      job_title: e.target.value,
                    }))
                  }
                  placeholder="e.g. Software Developer Intern"
                  required
                  disabled={action === "View" ? true : false}
                />
              </div>

              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <textarea
                  id="job-description"
                  className="border w-full h-24 rounded-md text-gray-900 p-3 focus:ring-2 focus:ring-gray-400"
                  value={jobData.job_description}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      job_description: e.target.value,
                    }))
                  }
                  placeholder="Describe the job role..."
                  required
                  disabled={action === "View" ? true : false}
                />
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.skill_name}
                  {action !== "View" && (
                    <button
                      type="button"
                      className="ml-2 text-purple-700 hover:text-purple-900"
                      onClick={() => removeRequiredSkill(skill.skill_id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {action !== "View" && (
              <div className="relative">
                <Input
                  type="text"
                  value={requiredSkillInput}
                  onChange={(e) => setRequiredSkillInput(e.target.value)}
                  placeholder="Search and select skill"
                  className="h-11"
                />
                {requiredSkillInput && filteredRequiredSkills.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 max-h-40 w-full overflow-y-auto shadow-md">
                    {filteredRequiredSkills.map((s) => (
                      <div
                        key={s.skill_id}
                        onClick={() => addRequiredSkill(s)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {s.skill_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preferred Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preferred Skills
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {preferredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.skill_name}
                  {action !== "View" && (
                    <button
                      type="button"
                      className="ml-2 text-purple-700 hover:text-purple-900"
                      onClick={() => removePreferredSkill(skill.skill_id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {action !== "View" && (
              <div className="relative">
                <Input
                  type="text"
                  value={preferredSkillInput}
                  onChange={(e) => setPreferredSkillInput(e.target.value)}
                  placeholder="Search and select skill"
                  className="h-11"
                />
                {preferredSkillInput && filteredPreferredSkills.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 max-h-40 w-full overflow-y-auto shadow-md">
                    {filteredPreferredSkills.map((s) => (
                      <div
                        key={s.skill_id}
                        onClick={() => addPreferredSkill(s)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {s.skill_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="job-status">Job Status</Label>
                <select
                  id="job-status"
                  className="border w-full rounded-md h-11 px-3 text-gray-900 focus:ring-2 focus:ring-gray-400"
                  value={jobData.status.status}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      status: { ...prev.status, status: e.target.value },
                    }))
                  }
                  disabled={action === "View" ? true : false}
                  required
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status-reason">Status Reason</Label>
                <textarea
                  id="status-reason"
                  className="border w-full h-24 rounded-md text-gray-900 p-3 focus:ring-2 focus:ring-gray-400"
                  value={jobData.status.reason}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      status: { ...prev.status, reason: e.target.value },
                    }))
                  }
                  placeholder="Reason for this status..."
                  required
                  disabled={action === "View" ? true : false}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          {(action === "Insert" || action === "Update") && (
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gray-800 text-white hover:bg-black px-6 py-2 rounded-md transition cursor-pointer"
              >
                {action === "Insert" ? "Create" : "Update"} Job
              </Button>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

export default AddJob;
