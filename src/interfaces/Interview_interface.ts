import type { JobDtoCandidate } from "./Jobs_interface";

export interface InterviewDtoCandidate{
    interview_id: number;
    job_id: number;
    job: JobDtoCandidate;
}

export interface SheduleInterviewDto{
    job_id: number,
    round_number: number,
    scheduled_start_time: Date | null,
    duration_per_interview: number,
    interviewers: string[][],
    panel_links: (string|undefined)[],
    scheduled_by: string,
    location: string,
    interview_type_id: number,
    result_of:number
}

export interface DeleteRoundDto{
    job_id: number,
    round_number: number
}

export interface CandidateInterviewReq{
    job_id: number,
    candidate_id: string
}

export interface UpdateCandidateInterview{
    interview_id: number,
    location_or_link: string,
    mode: string,
    status: string,
    users: string[]
}

export interface CandidateInterview {
  interview_id: number;
  round_number: number;
  location_or_link: string;
  mode: string;
  start_time: string;
  end_time: string;
  status: string;
  interview_type: {
    interview_round_name: string;
    process_descreption: string;
  };
  users: {
    user_id: string;
    name: string;
  }[];
};