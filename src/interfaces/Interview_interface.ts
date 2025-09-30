import type { JobDtoCandidate } from "./Jobs_interface";

export interface InterviewDtoCandidate{
    interview_id: number;
    job_id: number;
    job: JobDtoCandidate;
}