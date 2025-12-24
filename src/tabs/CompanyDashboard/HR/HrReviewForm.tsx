import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/custom/StarRating";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import {
  checkCandidateInterviewHistory,
  fetchCandidateData,
  updateInterviewStatus,
} from "@/api/Interview_api";
import { useParams } from "react-router-dom";
import type { InterviewHistory } from "../Interviewer/SkillReview";
import type { HrReview } from "@/interfaces/Hr_review_interface";
import { addOrUpdateHrReview, getHrReview } from "@/api/Hr_Review_api";

interface CandidateData {
  candidate_id: string;
  full_name: string;
  email: string;
  resume_path?: string | null;
}

const HrReviewForm = () => {
  const [review, setReview] = useState<HrReview | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [interviewHist, setInterviewHist] = useState<InterviewHistory[]>([]);

  const { user } = useAuth();
  const { interviewId } = useParams<{ interviewId: string }>();
  const VITE_DOCUMENT_URL = import.meta.env.VITE_DOCUMENT_URL;

  const calculateTotalRating = (rev: HrReview | null) => {
    if (!rev) return "0.0";
    const totalWeight = 3 + 3 + 3 + 2.5 + 1.5; // 13
    const weightedSum =
      (rev.communication_rating / 5) * 3 +
      (rev.overall_rating / 5) * 3 +
      (rev.leadership_rating / 5) * 3 +
      (rev.teamwork_rating / 5) * 2.5 +
      (rev.adaptability_rating / 5) * 1.5;
    return ((weightedSum / totalWeight) * 10).toFixed(1);
  };

  const totalRating = calculateTotalRating(review);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const candidateRes = await fetchCandidateData(Number(interviewId), user.token);
        setCandidateData(candidateRes.candidate_data);

        const reviewRes = await getHrReview(
          { interview_id: Number(interviewId), user_id: user.userId },
          user.token
        );

        // Only set review if API returns a review
        if (reviewRes) setReview(reviewRes);
      } catch (err: any) {
        notify.error("Error", err.message);
      }
    };

    const fetchInterviewHistory = async () => {
      try {
        const historyRes = await checkCandidateInterviewHistory(Number(interviewId), user.token);
        setInterviewHist(historyRes);
      } catch (err: any) {
        notify.error("Error", err.message);
      }
    };

    fetchData();
    fetchInterviewHistory();
  }, [user, interviewId]);

  const handleStatusChange = async (status: string) => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    try {
      await updateInterviewStatus({ interview_id: Number(interviewId), status }, user.token);
      notify.success("Status Change", "Candidate Status Change Successfully");
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  const handleRatingChange = (field: keyof HrReview, value: number) => {
    setReview((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!user?.token || !review) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    try {
      const updatedReview: HrReview = { ...review, user_id: user.userId, interview_id: Number(interviewId), total_score: Number(totalRating)};
      const res = await addOrUpdateHrReview(updatedReview, user.token);
      setReview(res);
      notify.success("Saved", "Review saved successfully");
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  return (
    <div>
      {interviewHist.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <div className="mb-2 flex items-center font-semibold">
            ⚠️ <span className="ml-2">Candidate has already appeared for interviews</span>
          </div>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {interviewHist.map((item, index) => (
              <li key={index}>{item.job_title}</li>
            ))}
          </ul>
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div className="font-semibold">{candidateData?.full_name ?? "Candidate"}</div>
            <div className="text-sm text-muted-foreground">{candidateData?.email ?? ""}</div>
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
              Total Score: <span>{totalRating}</span> <span className="text-gray-400">/ 10</span>
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

      {review && (
        <Card className="mx-auto mt-6">
          <CardContent className="space-y-6">
            {/* Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(["communication_rating","teamwork_rating","adaptability_rating","leadership_rating"] as (keyof HrReview)[]).map((field) => (
                <div key={field}>
                  <Label className="mb-2 block">
                    {field.replace("_rating", "").replace("_", " ").toUpperCase()}
                  </Label>
                  <StarRating
                    rating={review[field] as number}
                    onChange={(v) => handleRatingChange(field, v)}
                  />
                </div>
              ))}
            </div>

            <hr />

            <div>
              <Label className="mb-2 block font-medium">Overall Rating</Label>
              <StarRating
                rating={review.overall_rating}
                onChange={(v) => handleRatingChange("overall_rating", v)}
              />
            </div>

            <hr />

            {/* Text Areas */}
            {(["strengths","areas_for_improvement","training_recommendations","career_path_notes"] as (keyof HrReview)[]).map((field) => (
              <div key={field}>
                <Label className="mb-2 block font-medium">
                  {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
                <Textarea
                  name={field}
                  value={review[field] as string}
                  onChange={handleChange}
                  className="min-h-[90px]"
                />
              </div>
            ))}

            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="px-8">
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HrReviewForm;
