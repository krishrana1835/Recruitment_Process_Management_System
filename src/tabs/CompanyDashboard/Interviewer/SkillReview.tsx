// SkillReview.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/custom/StarRating";
import { notify } from "@/components/custom/Notifications";
import {
  checkCandidateInterviewHistory,
  fetchCandidateData,
  fetchCandidateResumeSkills,
  updateInterviewStatus,
} from "@/api/Interview_api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/route_protection/AuthContext";
import { getSkills } from "@/api/Skill_api";
import {
  addOrUpdateCandidateInterviewFeedback,
  fetchCandidateFeedback,
} from "@/api/InterviewFeedback_api";

interface Skill {
  skill_id: number;
  skill_name: string;
}

type SkillType = "R" | "P";

interface JobSkill {
  skill_id: number;
  skill_type: SkillType;
  skill: Skill;
}

interface CandidateSkill {
  skill_id: number;
  skill_name: string;
}

interface CandidateData {
  candidate_id: string;
  full_name: string;
  email: string;
  resume_path?: string | null;
}

export interface SkillApiData {
  job_skills: JobSkill[];
  candidate_skills: CandidateSkill[];
  candidate_data: CandidateData;
}

interface SkillReviewData {
  yearsOfExperience: number;
  conceptRating: number;
  technicalRating: number;
  comments: string;
}

interface SkillWithReview extends JobSkill {
  review: SkillReviewData;
}

export interface InterviewSkillSubmission {
  interview_id: number;
  user_id: string;
  candidate_id: string;
  total_score: number;
  required_skills: SkillWithReview[];
  preferred_skills: SkillWithReview[];
  extra_skills: SkillWithReview[];
}

export interface InterviewHistory {
  job_id: number;
  job_title: string;
  sheduled: null;
}

const emptyReview: SkillReviewData = {
  yearsOfExperience: 0,
  conceptRating: 0,
  technicalRating: 0,
  comments: "",
};

const normalizeSkill = (s: any): SkillWithReview => ({
  skill_id: s.skill_id,
  skill_type: s.skill_type ?? "P",
  skill: s.skill ?? {
    skill_id: s.skill_id,
    skill_name: s.skill_name ?? "Unknown Skill",
  },
  review: s.review ?? { ...emptyReview },
});

export default function SkillReview() {
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);
  const [candidateSkills, setCandidateSkills] = useState<CandidateSkill[]>([]);
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null
  );

  const VITE_DOCUMENT_URL = import.meta.env.VITE_DOCUMENT_URL;

  const { interviewId } = useParams<{ interviewId: string }>();
  const { user } = useAuth();

  const [skillsWithReview, setSkillsWithReview] = useState<SkillWithReview[]>(
    []
  );
  const [extraSkills, setExtraSkills] = useState<SkillWithReview[]>([]);
  const [skillSearch, setSkillSearch] = useState<string>("");
  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false);
  const [totalRating, setTotalRating] = useState<number>(0);
  const [allSkillsCatalog, setAllSkillsCatalog] = useState<Skill[]>([]);
  const [interviewHist, setInterviewHist] = useState<InterviewHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        notify.error("Session Expired", "Please login again");
        return;
      }

      try {
        const res = await fetchCandidateData(Number(interviewId), user.token);
        const { job_skills = [], candidate_skills = [], candidate_data } = res;

        setJobSkills(job_skills);
        setCandidateSkills(candidate_skills);
        setCandidateData(candidate_data);

        const hasResume =
          candidate_data?.resume_path &&
          candidate_data.resume_path.trim() !== "";

        if (hasResume) {
          const response = await fetchCandidateResumeSkills(
            { path: candidate_data.resume_path },
            user.token
          );
          setCandidateSkills(response.skills ?? []);
        }

        let feedbackResponse = null;

        feedbackResponse = await fetchCandidateFeedback(
          { interview_id: Number(interviewId), user_id: user.userId },
          user.token
        );

        const hasFeedback =
          feedbackResponse &&
          ((feedbackResponse.required_skills?.length ?? 0) > 0 ||
            (feedbackResponse.preferred_skills?.length ?? 0) > 0 ||
            (feedbackResponse.extra_skills?.length ?? 0) > 0);

        if (hasFeedback) {
          const mergedSkills = [
            ...(feedbackResponse?.required_skills ?? []).map(normalizeSkill),
            ...(feedbackResponse?.preferred_skills ?? []).map(normalizeSkill),
          ];

          setSkillsWithReview(mergedSkills);
          setExtraSkills(
            (feedbackResponse?.extra_skills ?? []).map(normalizeSkill)
          );
        } else {
          const initial = job_skills.map((j) =>
            normalizeSkill({
              ...j,
              skill_name: j.skill?.skill_name,
              review: emptyReview,
            })
          );

          setSkillsWithReview(initial);
        }

        const skillCatalog = await getSkills();
        setAllSkillsCatalog(skillCatalog ?? []);
      } catch (err: any) {
        notify.error("Error", err.message);
      }
    };

    const fetchIntervieHistory = async () => {
      if (!user?.token) {
        notify.error("Session Expired", "Please login again");
        return;
      }
      try {
        const res = await checkCandidateInterviewHistory(
          Number(interviewId),
          user.token
        );
        console.log(res)
        setInterviewHist(res);
      } catch (err: any) {
        notify.error("Error", err.message);
      }
    };

    fetchData();
    fetchIntervieHistory();
  }, []);

  useEffect(() => {
    const all = [...skillsWithReview, ...extraSkills];

    if (all.length === 0) {
      setTotalRating(0);
      return;
    }

    const total = all.reduce((sum, skill) => {
      const c = Number(skill.review.conceptRating || 0);
      const t = Number(skill.review.technicalRating || 0);
      return sum + c + t;
    }, 0);

    const average = total / all.length;

    setTotalRating(Number(average.toFixed(2)));
  }, [skillsWithReview, extraSkills]);

  const jobSkillIds = useMemo(
    () => new Set(jobSkills.map((s) => s.skill_id)),
    [jobSkills]
  );
  const extraSkillIds = useMemo(
    () => new Set(extraSkills.map((s) => s.skill_id)),
    [extraSkills]
  );

  const suggestions = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    if (!q)
      return allSkillsCatalog.filter(
        (s) => !jobSkillIds.has(s.skill_id) && !extraSkillIds.has(s.skill_id)
      );
    return allSkillsCatalog
      .filter((s) => s.skill_name.toLowerCase().includes(q))
      .filter(
        (s) => !jobSkillIds.has(s.skill_id) && !extraSkillIds.has(s.skill_id)
      );
  }, [skillSearch, jobSkillIds, extraSkillIds]);

  const addExtraSkillBySkill = (skill: Skill) => {
    if (jobSkillIds.has(skill.skill_id)) {
      notify.error(
        "Already a job skill",
        `${skill.skill_name} is already required/preferred for this job.`
      );
      return;
    }
    if (extraSkillIds.has(skill.skill_id)) {
      setExtraSkills((prev) =>
        prev.filter((s) => s.skill_id !== skill.skill_id)
      );
      notify.info(
        "Skill Removed",
        `${skill.skill_name} is removed from extra skills.`
      );
      return;
    }

    const newSkill: SkillWithReview = {
      skill_id: skill.skill_id,
      skill_type: "P",
      skill: { ...skill },
      review: { ...emptyReview },
    };
    setExtraSkills((prev) => [...prev, newSkill]);

    setCandidateSkills((prev) => {
      if (prev.find((cs) => cs.skill_id === skill.skill_id)) return prev;
      return [
        ...prev,
        { skill_id: skill.skill_id, skill_name: skill.skill_name },
      ];
    });

    setSkillSearch("");
    setSuggestionsOpen(false);
    notify.info("Added", `${skill.skill_name} added to extra skills.`);
  };

  const handleReviewChange = <K extends keyof SkillReviewData>(
    skillId: number,
    field: K,
    value: SkillReviewData[K]
  ) => {
    setSkillsWithReview((prev) =>
      prev.map((s) =>
        s.skill_id === skillId
          ? { ...s, review: { ...s.review, [field]: value } }
          : s
      )
    );
    setExtraSkills((prev) =>
      prev.map((s) =>
        s.skill_id === skillId
          ? { ...s, review: { ...s.review, [field]: value } }
          : s
      )
    );
  };

  const handleSave = async ({
    requiredSkills,
    preferredSkills,
    extraSkills,
  }: {
    requiredSkills: SkillWithReview[];
    preferredSkills: SkillWithReview[];
    extraSkills: SkillWithReview[];
  }) => {
    if (!user?.userId) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    if (!candidateData?.candidate_id) {
      notify.error("Invalid canidate id", "Plese relaod page");
      return;
    }

    const payload: InterviewSkillSubmission = {
      user_id: user?.userId,
      interview_id: Number(interviewId),
      candidate_id: candidateData.candidate_id,
      total_score: totalRating,
      required_skills: requiredSkills,
      preferred_skills: preferredSkills,
      extra_skills: extraSkills,
    };

    try {
      await addOrUpdateCandidateInterviewFeedback(payload, user.token);
      notify.success("Saved", "Feedback Saved");
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    try {
      await updateInterviewStatus(
        { interview_id: Number(interviewId), status: status },
        user?.token
      );
      notify.success("Status Change", "Candidate Status Change Successfully");
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  const requiredSkills = skillsWithReview.filter((s) => s.skill_type === "R");
  const preferredSkills = skillsWithReview.filter((s) => s.skill_type === "P");

  const renderSkillCard = (skill: SkillWithReview) => {
    const isRequired = skill.skill_type === "R";
    return (
      <Card key={skill.skill_id} className="border shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {skill.skill.skill_name || "New Skill"}
          </CardTitle>
          <Badge variant={isRequired ? "destructive" : "secondary"}>
            {isRequired ? "Required" : "Preferred"}
          </Badge>
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Concept Rating</label>
            <StarRating
              rating={skill.review.conceptRating}
              onChange={(v) =>
                handleReviewChange(skill.skill_id, "conceptRating", v)
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Technical Rating</label>
            <StarRating
              rating={skill.review.technicalRating}
              onChange={(v) =>
                handleReviewChange(skill.skill_id, "technicalRating", v)
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Years of Experience</label>
            <Input
              type="number"
              min={0}
              required
              value={Number(skill.review.yearsOfExperience) || 0}
              onChange={(e) =>
                handleReviewChange(
                  skill.skill_id,
                  "yearsOfExperience",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Comments</label>
            <Textarea
              value={skill.review.comments}
              required
              onChange={(e) =>
                handleReviewChange(skill.skill_id, "comments", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {interviewHist.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <div className="mb-2 flex items-center font-semibold">
            ⚠️{" "}
            <span className="ml-2">
              Candidate has already appeared for interviews
            </span>
          </div>

          <ul className="list-disc pl-6 space-y-1 text-sm">
            {interviewHist.map((item, index) => (
              <li key={index}>{item.job_title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Candidate card */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="">
            <div className="font-semibold">
              {candidateData?.full_name ?? "Candidate"}
            </div>
            <div className="text-sm text-muted-foreground">
              {candidateData?.email ?? ""}
            </div>
            <div className="mt-4">
              {candidateData?.resume_path ? (
                <a
                  href={VITE_DOCUMENT_URL + candidateData.resume_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black rounded-sm text-white p-2 hover:bg-gray-700"
                >
                  Resume
                </a>
              ) : (
                <span className="text-sm text-gray-500">No Resume</span>
              )}
            </div>
          </div>
          <div className="flex justify-end items-end flex-col">
            <div className="pt-3 font-semibold">
              Total Score: <span className="">{totalRating}</span>
              <span className="text-gray-400"> / 10</span>
            </div>
            <div className="flex flex-row gap-2 mt-3">
              <Button
                variant="destructive"
                className="hover:bg-red-800 cursor-pointer"
                onClick={() => handleStatusChange("Rejected")}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                onClick={() => handleStatusChange("Selected")}
              >
                Select
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate skills chips */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Candidate Skills</h2>
        <div className="flex flex-wrap gap-2">
          {candidateSkills.length > 0 ? (
            candidateSkills.map((cs) => (
              <button
                key={cs.skill_id}
                onClick={() => {
                  const existingJob = jobSkills.find(
                    (j) => j.skill_id === cs.skill_id
                  );
                  if (existingJob) {
                    notify.error(
                      "Job Skill",
                      `${cs.skill_name} is already a job skill.`
                    );
                    return;
                  }
                  addExtraSkillBySkill({
                    skill_id: cs.skill_id,
                    skill_name: cs.skill_name,
                  });
                }}
                className="font-semibold bg-purple-600 text-white rounded-full px-4 py-1 text-sm cursor-pointer"
                title="Click to add as a reviewable extra skill"
              >
                {cs.skill_name}
              </button>
            ))
          ) : (
            <div className="text-gray-600">( No Skills Found )</div>
          )}
        </div>
      </section>

      {/* add new skill input + suggestions */}
      <section>
        <h3 className="text-lg font-medium mb-2">Add / Search Skill</h3>

        <div className="flex flex-row items-start gap-2">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Type skill name (e.g. React). Press Enter to add new or choose suggestion."
              className="bg-white p-2 shadow-sm"
              value={skillSearch}
              onChange={(e) => {
                setSkillSearch(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const exact = suggestions.find(
                    (s) =>
                      s.skill_name.toLowerCase() ===
                      skillSearch.trim().toLowerCase()
                  );
                  if (exact) addExtraSkillBySkill(exact);
                } else if (e.key === "Escape") {
                  setSuggestionsOpen(false);
                }
              }}
            />

            {suggestionsOpen && suggestions.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-white shadow-lg">
                {suggestions.map((s) => (
                  <li
                    key={s.skill_id}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      addExtraSkillBySkill(s);
                    }}
                  >
                    {s.skill_name}
                  </li>
                ))}
              </ul>
            )}

            {suggestionsOpen &&
              suggestions.length === 0 &&
              skillSearch.trim().length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-600">
                  No suggestions
                </div>
              )}
          </div>

          <Button
            variant="outline"
            className="cursor-pointer h-10"
            onClick={() => {
              setSkillSearch("");
              setSuggestionsOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </section>

      {/* Required Skills */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredSkills?.map(renderSkillCard)}
        </div>
      </section>

      {/* Preferred Skills */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Preferred Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferredSkills?.map(renderSkillCard)}
        </div>
      </section>

      {/* Extra Skills (added by reviewer) */}
      {extraSkills.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Extra Candidate Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraSkills?.map(renderSkillCard)}
          </div>
        </section>
      )}

      <div className="flex items-center justify-center">
        <Button
          variant="default"
          className="w-xl cursor-pointer"
          onClick={() =>
            handleSave({
              requiredSkills,
              preferredSkills,
              extraSkills,
            })
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
