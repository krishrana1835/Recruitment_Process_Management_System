import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/route_protection/AuthContext";
import { useParams } from "react-router-dom";
import { notify } from "@/components/custom/Notifications";
import {
  fetchRoundRatingCard,
  getCandidatesOverAllscore,
} from "@/api/RatingCard_api";

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

  const totalWeight = 3 + 3 + 3 + 2.5 + 1.5;

  const weightedSum =
    (rev.communication_rating / 5) * 3 +
    (rev.overall_rating / 5) * 3 +
    (rev.leadership_rating / 5) * 3 +
    (rev.teamwork_rating / 5) * 2.5 +
    (rev.adaptability_rating / 5) * 1.5;

  return (weightedSum / totalWeight) * 10;
};

const calculateRoundTotal = (round: RoundData) => {
  const isHrRound = round.interviewType.interview_round_name
    .toLowerCase()
    .includes("hr");

  const ratings = round.users.map((user) => {
    if (isHrRound) {
      const hrReview = round.hrReviews.find((r) => r.user_id === user.user_id);
      return calculateHrTotalRating(hrReview || null);
    }

    const feedbacks = round.interviewFeedbacks.filter(
      (f) => f.user_id === user.user_id
    );

    return calculateInterviewAverage(feedbacks);
  });

  if (!ratings.length) return 0;

  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

const calculateOverallScore = (rounds: RoundData[]) => {
  if (!rounds.length) return 0;

  const avgRound =
    rounds.reduce((sum, r) => sum + calculateRoundTotal(r), 0) / rounds.length;

  return (avgRound / 10) * 100;
};

export default function InterviewRatingCard({
  type,
}: {
  type: "RoundRatingCard" | "OverAllRatingCard";
}) {
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
        notify.error("Error", "Invalid parameters");
        return;
      }

      const payload: ReqestPayload = {
        job_id: jobIdNum,
        candidate_id: candidateId,
        round_number: roundNumberNum,
      };

      if (type === "OverAllRatingCard") {
        const res = await getCandidatesOverAllscore(payload, user.token);
        setRounds(res);
      } else {
        const res = await fetchRoundRatingCard(payload, user.token);
        setRounds(res);
      }
    };

    fetchData();
  }, []);

  const overallScore = useMemo(() => calculateOverallScore(rounds), [rounds]);

  return (
    <Card className="space-y-6 bg-white">
      <CardContent>
        <div className="flex justify-between items-center pb-6">
          <div>
            {type === "OverAllRatingCard" ? (
              <div className="">
                <h2 className="text-xl font-semibold">
                  Overall Candidate Score
                </h2>
                <p className="text-sm text-muted-foreground">
                  Average of all interview rounds
                </p>
              </div>
            ) : (
              <div className="">
                <h2 className="text-xl font-semibold">Candidate Score</h2>
                <p className="text-sm text-muted-foreground">
                  Score as per round performance
                </p>
              </div>
            )}
          </div>
          <Badge className="text-lg px-4 py-2">
            {overallScore.toFixed(1)}%
          </Badge>
        </div>

        <hr className="pb-6" />

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

        {rounds.map((round, idx) => {
          const isHrRound = round.interviewType.interview_round_name
            .toLowerCase()
            .includes("hr");

          const roundTotal = calculateRoundTotal(round);

          return (
            <div key={idx} className="space-y-4">
              <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-semibold">
                  {round.interviewType.interview_round_name}
                </h2>
                <Badge variant="secondary">
                  Round Avg: {roundTotal.toFixed(1)} / 10
                </Badge>
              </div>

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
                            ["Communication", hrReview.communication_rating],
                            ["Leadership", hrReview.leadership_rating],
                            ["Teamwork", hrReview.teamwork_rating],
                            ["Adaptability", hrReview.adaptability_rating],
                            ["Overall", hrReview.overall_rating],
                          ].map(([label, value], i) => (
                            <div
                              key={i}
                              className="flex justify-between border rounded-md p-3"
                            >
                              <span>{label}</span>
                              <span className="font-semibold">{value} / 5</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isHrRound && userFeedbacks.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold">Skill Ratings</p>
                          {userFeedbacks.map((fb, i) => {
                            const avg =
                              (fb.concept_rating + fb.technical_rating) / 2;
                            return (
                              <div key={i} className="border rounded-md p-3">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {fb.candidaete_Skill.skill.skill_name}
                                  </span>
                                  <span className="font-semibold">
                                    {avg.toFixed(1)} / 5
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground flex gap-6">
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
              <hr className="mt-6" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
