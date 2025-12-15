import type { ReqestPayload, RoundData } from "@/tabs/CompanyDashboard/Interviewer/InterviewRatingCard";
import { apiRequest } from "./apiRequest";

export function fetchRoundRatingCard(data: ReqestPayload, token: string) {
  return apiRequest<RoundData[]>("/RatingCard/GetRoundRating", "POST", token, data);
}