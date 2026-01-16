import type { ReqestPayload, RoundData } from "@/tabs/CompanyDashboard/Interviewer/InterviewRatingCard";
import { apiRequest } from "./apiRequest";
import type { CandidatesWithScores } from "@/tabs/CompanyDashboard/HR/ListCandidatesWithScores";

export function fetchRoundRatingCard(data: ReqestPayload, token: string) {
  return apiRequest<RoundData[]>("/RatingCard/GetRoundRating", "POST", token, data);
}

export function getCandidatesWithScore(data: {job_id: number, round_number :number}, token: string) {
  return apiRequest<CandidatesWithScores[]>(`/RatingCard/GetCandidateWithSocre?job_id=${data.job_id}&round_number=${data.round_number}`, "GET", token);
}

export function getCandidatesOverAllscore(data: ReqestPayload, token: string) {
  return apiRequest<RoundData[]>(`/RatingCard/GetCandidateAllScores?job_id=${data.job_id}&round_number=${data.round_number}&candidate_id=${data.candidate_id}`, "GET", token);
}