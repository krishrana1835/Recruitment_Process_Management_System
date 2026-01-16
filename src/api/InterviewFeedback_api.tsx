import type { InterviewSkillSubmission } from "@/tabs/CompanyDashboard/Interviewer/SkillReview";
import { apiRequest } from "./apiRequest";

export function addOrUpdateCandidateInterviewFeedback(data: InterviewSkillSubmission , token: string) {
  return apiRequest<any>(`/Interview_Feedback/AddOrUpdateFeedback`, "POST", token, data);
}

export function fetchCandidateFeedback(data: {interview_id: number, user_id: string} , token: string) {
  return apiRequest<InterviewSkillSubmission>(`/Interview_Feedback/GetFeedback?interview_id=${data.interview_id}&user_id=${data.user_id}`, "GET", token);
}