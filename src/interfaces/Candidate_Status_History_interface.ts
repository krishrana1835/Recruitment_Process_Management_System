import type { ListJobStatusDto, ShowJobTitleDto } from "./Jobs_interface";

export interface CandidateStatusHistoryDto {
    candidate_status_id: number;
    status: string;
    reason: string;
    changed_at: Date;
    job: ShowJobTitleDto;
}

export interface ApplyForJobByCandidateDto{
    candidate_id: string;
    job_id: number;
}

export interface ListJobApplicationStatus{
    candidate_status_id: string;
    status: string;
    changed_at: string;
    job: ListJobStatusDto;
}

export const CandidateStatus = {
  Applied: "Applied",
  Shortlisted: "Shortlisted",
  InterviewScheduled: "InterviewScheduled",
  InterviewCompleted: "InterviewCompleted",
  OnHold: "OnHold",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Hired: "Hired"
};

export interface ChangeCandidateStatusDto{
    candidate_id: string;
    job_id: number;
    status: keyof typeof CandidateStatus;
    reason: string;
    changed_by: string;
}