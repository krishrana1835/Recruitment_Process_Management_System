import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/* ---------------- TYPES ---------------- */

type ApiResponse = {
  success: boolean;
  data: RoundData[];
};

type RoundData = {
  candidate: {
    candidate_id: string;
    full_name: string;
    email: string;
  };
  interviewType: {
    interview_round_name: string;
    process_descreption: string;
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

/* ---------------- HELPERS ---------------- */

const calculateTechnicalReviewerRating = (feedbacks: InterviewFeedback[]) => {
  if (!feedbacks.length) return 0;

  const total = feedbacks.reduce(
    (sum, f) => sum + (f.concept_rating + f.technical_rating) / 2,
    0
  );

  return ((total / feedbacks.length) / 5) * 10;
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

/* ---------------- COMPONENT ---------------- */

export default function InterviewRatingFromApi() {
  const { jobId, roundNumber, candidateId } = useParams<{
    jobId: string;
    roundNumber: string;
    candidateId: string;
  }>();

  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [minRating, setMinRating] = useState(6);

  useEffect(() => {
    if (!jobId || !roundNumber || !candidateId) return;

    fetch(
      `/api/interview/round-rating?jobId=${jobId}&round=${roundNumber}&candidateId=${candidateId}`
    )
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        if (res.success) setRounds(res.data);
      });
  }, [jobId, roundNumber, candidateId]);

  return (
    <div className="space-y-6">
      {/* Minimum Cutoff */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Minimum Rating (out of 10)</span>
        <Input
          type="number"
          className="w-24"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        />
      </div>

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

            {/* Reviewer Cards */}
            {round.users.map((user) => {
              const userFeedbacks = round.interviewFeedbacks.filter(
                (f) => f.user_id === user.user_id
              );

              const hrReview = round.hrReviews.find(
                (r) => r.user_id === user.user_id
              );

              const rating = isHrRound
                ? calculateHrTotalRating(hrReview || null)
                : calculateTechnicalReviewerRating(userFeedbacks);

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

                  <CardContent className="space-y-4 text-sm">
                    {/* HR Round Details */}
                    {isHrRound && hrReview && (
                      <>
                        <p>Communication: {hrReview.communication_rating}/5</p>
                        <p>Leadership: {hrReview.leadership_rating}/5</p>
                        <p>Teamwork: {hrReview.teamwork_rating}/5</p>
                        <p>Adaptability: {hrReview.adaptability_rating}/5</p>
                        <p>Overall: {hrReview.overall_rating}/5</p>
                      </>
                    )}

                    {/* Technical Skill Ratings */}
                    {!isHrRound && userFeedbacks.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold">Skill Ratings</p>

                        {userFeedbacks.map((fb, index) => {
                          const skillAvg = (
                            (fb.concept_rating + fb.technical_rating) /
                            2
                          ).toFixed(1);

                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center rounded-md border p-2"
                            >
                              <div>
                                <p className="font-medium">
                                  {fb.candidaete_Skill.skill.skill_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Concept: {fb.concept_rating}/5 · Technical:{" "}
                                  {fb.technical_rating}/5
                                </p>
                              </div>
                              <div className="font-semibold">
                                {skillAvg} / 5
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <p className="font-semibold">
                      Status:{" "}
                      <span
                        className={
                          selected ? "text-green-600" : "text-red-600"
                        }
                      >
                        {selected ? "Selected" : "Rejected"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}