import type { InterviewerReportReq } from "@/tabs/CompanyDashboard/Reports/InterviewerReports";
import { apiRequest } from "./apiRequest";
import type { InterviewSummaryResponse } from "@/components/custom/InterviewerSummary";
import type { TechnologyWiseDataReq, TechnologyWiseDataRes } from "@/tabs/CompanyDashboard/Reports/TechWiseReport";
import type { ExperienceWiseDataReq } from "@/tabs/CompanyDashboard/Reports/ExperienceWiseReport";
import type { DailySummary } from "@/tabs/CompanyDashboard/Reports/DailySummary";
import type { CandidateSummaryResponse } from "@/tabs/CompanyDashboard/Reports/CandidateSummary";

export function getInterviewerSummary(data: InterviewerReportReq , token: string) {
  return apiRequest<InterviewSummaryResponse[]>(`/Reports/interview-summary`, "POST", token, data);
}

export function getTechnologyWiseProfiles(data: TechnologyWiseDataReq , token: string) {
  return apiRequest<TechnologyWiseDataRes[]>(`/Reports/TechWiseProfiles`, "POST", token, data);
}

export function getGetExperienceWiseProfiles(data: ExperienceWiseDataReq , token: string) {
  return apiRequest<TechnologyWiseDataRes[]>(`/Reports/ExperienceWiseProfiles`, "POST", token, data);
}

export function getDailySummary(data: string , token: string) {
  return apiRequest<DailySummary>(`/Reports/daily-summary?date=${encodeURIComponent(data)}`, "GET", token);
}

export function getCandidateSummary(data: string , token: string) {
  return apiRequest<CandidateSummaryResponse>(`/Reports/candidate-summary?CandidateId=${data}`, "GET", token);
}