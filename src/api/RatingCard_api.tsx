import type { ReqestPayload, RoundData } from "@/tabs/CompanyDashboard/Interviewer/InterviewRatingCard";
import { apiRequest } from "./apiRequest";
import type { CandidatesWithScores } from "@/tabs/CompanyDashboard/HR/ListCandidatesWithScores";

export function fetchRoundRatingCard(data: ReqestPayload, token: string) {
  return apiRequest<RoundData[]>("/RatingCard/GetRoundRating", "POST", token, data);
}

export function getCandidatesWithScore(data: {job_id: number, round_number :number}, token: string) {
  return apiRequest<CandidatesWithScores[]>(`/RatingCard/GetCandidateWithSocre/${data.job_id}/${data.round_number}`, "GET", token);
}

export function getCandidatesOverAllscore(data: ReqestPayload, token: string) {
  return apiRequest<RoundData[]>(`/RatingCard/GetCandidateAllScores/${data.job_id}/${data.round_number}/${data.candidate_id}`, "GET", token);
}