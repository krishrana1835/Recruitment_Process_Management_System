import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/route_protection/AuthContext";
import { useParams } from "react-router-dom";
import { notify } from "@/components/custom/Notifications";
import { fetchRoundRatingCard } from "@/api/RatingCard_api";

/* ------------------ TYPES ------------------ */

export type RoundData = {
  candidate: {
    candidate_id: string;
    full_name: string;
    email: string;
  };
  interviewType: {
    interview_round_name: string;
  };
  users: User[];
  interviewFeedbacks: InterviewFeedback[];
  hrReviews: HrReview[];
};

type User = {
  user_id: string;
  name: string;
  email: string;
};

type InterviewFeedback = {
  user_id: string;
  concept_rating: number;
  technical_rating: number;
  candidaete_Skill: {
    skill: {
      skill_name: string;
    };
  };
};

type HrReview = {
  user_id: string;
  adaptability_rating: number;
  communication_rating: number;
  leadership_rating: number;
  teamwork_rating: number;
  overall_rating: number;
};

export interface ReqestPayload {
  job_id: number;
  candidate_id: string;
  round_number: number;
}

/* ------------------ HELPERS ------------------ */

const calculateInterviewAverage = (feedbacks: InterviewFeedback[]) => {
  if (!feedbacks.length) return 0;

  const total = feedbacks.reduce(
    (sum, f) => sum + (f.concept_rating + f.technical_rating) / 2,
    0
  );

  return (total / feedbacks.length / 5) * 10;
};

const calculateHrTotalRating = (rev: HrReview | null) => {
  if (!rev) return 0;

  const totalWeight = 3 + 3 + 3 + 2.5 + 1.5; // 13
  const weightedSum =
    (rev.communication_rating / 5) * 3 +
    (rev.overall_rating / 5) * 3 +
    (rev.leadership_rating / 5) * 3 +
    (rev.teamwork_rating / 5) * 2.5 +
    (rev.adaptability_rating / 5) * 1.5;

  return (weightedSum / totalWeight) * 10;
};

/* ------------------ COMPONENT ------------------ */

export default function InterviewRatingCard() {
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [minRating, setMinRating] = useState(6);

  const { user } = useAuth();

  const { jobId, roundNumber, candidateId } = useParams<{
    jobId: string;
    roundNumber: string;
    candidateId: string;
  }>();

  const jobIdNum = Number(jobId);
  const roundNumberNum = Number(roundNumber);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        notify.error("Session Expired", "Please login again.");
        return;
      }
      if (!candidateId) {
        notify.error("Error", "Error in reading parameters");
        return;
      }

      const payload: ReqestPayload = {
        job_id: jobIdNum,
        candidate_id: candidateId,
        round_number: roundNumberNum,
      };

      const res = await fetchRoundRatingCard(payload, user.token);
      setRounds(res);
    };

    fetchData();
  }, []);

  return (
    <Card className="space-y-6 bg-white">
      <CardContent>
        {/* Cutoff */}
        <div className="flex items-center gap-3 pb-6">
          <span className="text-sm font-medium">
            Minimum Rating (out of 10)
          </span>
          <Input
            type="number"
            className="w-24"
            max={10}
            min={0}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          />
        </div>

        <hr className="pb-6" />

        {/* Rounds */}
        {rounds.map((round, idx) => {
          const isHrRound = round.interviewType.interview_round_name
            .toLowerCase()
            .includes("hr");

          return (
            <div key={idx} className="space-y-4">
              <h2 className="text-lg font-semibold">
                {round.interviewType.interview_round_name}
              </h2>

              {/* Reviewers */}
              {round.users.map((user) => {
                const userFeedbacks = round.interviewFeedbacks.filter(
                  (f) => f.user_id === user.user_id
                );

                const hrReview = round.hrReviews.find(
                  (r) => r.user_id === user.user_id
                );

                const rating = isHrRound
                  ? calculateHrTotalRating(hrReview || null)
                  : calculateInterviewAverage(userFeedbacks);

                const selected = rating >= minRating;

                return (
                  <Card
                    key={user.user_id}
                    className={`border-2 ${
                      selected
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <CardHeader className="flex flex-row justify-between items-center">
                      <div>
                        <CardTitle>{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      <Badge variant={selected ? "default" : "destructive"}>
                        {rating.toFixed(1)} / 10
                      </Badge>
                    </CardHeader>

                    <CardContent className="text-sm space-y-4">
                      {/* HR Review */}
                      {isHrRound && hrReview && (
                        <div className="space-y-2">
                          <p className="font-semibold">HR Ratings</p>

                          {[
                            {
                              label: "Communication",
                              value: hrReview.communication_rating,
                            },
                            {
                              label: "Leadership",
                              value: hrReview.leadership_rating,
                            },
                            {
                              label: "Teamwork",
                              value: hrReview.teamwork_rating,
                            },
                            {
                              label: "Adaptability",
                              value: hrReview.adaptability_rating,
                            },
                            {
                              label: "Overall",
                              value: hrReview.overall_rating,
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center rounded-md border p-4"
                            >
                              <span className="font-medium">{item.label}</span>
                              <span className="font-semibold">
                                {item.value} / 5
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interview Skill Review */}
                      {!isHrRound && userFeedbacks.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold">Skill Ratings</p>

                          {userFeedbacks.map((fb, index) => {
                            const skillAvg =
                              (fb.concept_rating + fb.technical_rating) / 2;

                            return (
                              <div
                                key={index}
                                className="rounded-md border p-2 space-y-1"
                              >
                                <div className="flex justify-between items-center">
                                  <p className="font-medium">
                                    {fb.candidaete_Skill.skill.skill_name}
                                  </p>
                                  <span className="font-semibold">
                                    {skillAvg.toFixed(1)} / 5
                                  </span>
                                </div>

                                <div className="text-xs text-muted-foreground flex justify-between">
                                  <span>Concept: {fb.concept_rating}/5</span>
                                  <span>
                                    Technical: {fb.technical_rating}/5
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <p className="font-semibold pt-2">
                        Status:{" "}
                        <span
                          className={
                            selected ? "text-green-600" : "text-red-600"
                          }
                        >
                          {selected ? "Good" : "Bad"}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
