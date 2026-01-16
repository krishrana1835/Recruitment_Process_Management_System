import type { CandidateInterview, CandidateInterviewReq, DeleteRoundDto, SheduleInterviewDto, UpdateCandidateInterview } from "@/interfaces/Interview_interface";
import { apiRequest } from "./apiRequest";
import type { DeleteRound } from "@/tabs/CompanyDashboard/Recruiter/DeleteRound";
import type { CandidateInterviewSchedule } from "@/tabs/CompanyDashboard/Recruiter/CandidateInterviewShedule";
import type { InterviewHistory, SkillApiData } from "@/tabs/CompanyDashboard/Interviewer/SkillReview";
import type { CreateBulkCandidate } from "@/interfaces/Candidate_interface";
import type { Interviewer } from "@/tabs/CompanyDashboard/Reports/InterviewerReports";

export function scheduleInterview(data:SheduleInterviewDto , token: string) {
  return apiRequest<any>("/Interview/schedule", "POST", token, data);
}

export function fetchRounds(data: number , token: string) {
  return apiRequest<DeleteRound>(`/Interview/InterviewRounds?job_id=${data}`, "GET", token);
}

export function updateCandidateInterviweSchedule(data: UpdateCandidateInterview , token: string) {
  return apiRequest<CandidateInterviewSchedule[]>(`/Interview/UpdateCandidateSchedule`, "PUT", token, data);
}

export function fetchCandidateInterviweSchedule(data: DeleteRoundDto , token: string) {
  return apiRequest<CandidateInterviewSchedule[]>(`/Interview/CandidateInterviewSchedule`, "POST", token, data);
}

export function fetchCandidateInterviweScheduleInterviewer(data: DeleteRoundDto , token: string) {
  return apiRequest<CandidateInterviewSchedule[]>(`/Interview/CandidateInterviewSchedule/Interviewer`, "POST", token, data);
}

export function fetchCandidateInterviwes(data: CandidateInterviewReq , token: string) {
  return apiRequest<CandidateInterview[]>(`/Interview/CandidateInterview?job_id=${data.job_id}&candidate_id=${data.candidate_id}`, "GET", token);
}

export function fetchCandidateData(data: number , token: string) {
  return apiRequest<SkillApiData>(`/Interview/GetSkillDataForInterview?interview_id=${data}`, "GET", token);
}

export function fetchCandidateResumeSkills(data: any , token: string) {
  return apiRequest<any>(`/Resume/GetCandidateSkills`, "POST", token, data);
}

export function getShortlistedCandidates(data: number, token: string) {
  return apiRequest<CreateBulkCandidate[]>(`/Interview/GetAllShorlistedCandidates?job_id=${data}`, "GET", token);
}

export function updateInterviewStatus(data: {interview_id: number , status: string, user_id: string} , token: string) {
  return apiRequest<any>(`/Interview/UpdateInterviewStatus`, "PUT", token, data);
}

export function checkCandidateInterviewHistory(data: number , token: string) {
  return apiRequest<InterviewHistory[]>(`/Interview/CheckCandidateInterviewHistory?interview_id=${data}`, "GET", token);
}

export function deleteCandidateInterview(data: number , token: string) {
  return apiRequest<any>(`/Interview/DeleteCandidateInterview?interview_id=${data}`, "DELETE", token);
}

export function deleteRound(data: DeleteRoundDto , token: string) {
  return apiRequest<any>(`/Interview/InterviewRound`, "DELETE", token, data);
}

export function getInterviewers( data: number, token: string){
  return apiRequest<Interviewer[]>(`/Interview/GetAllInterviewers?job_id=${data}`, "GET", token);
}