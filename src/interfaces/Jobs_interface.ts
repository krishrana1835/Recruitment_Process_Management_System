import type { Jobs_Status_ListJobStatusDto, Jobs_StatusDto, ListAllJobs_Status } from "./Jobs_Status_interface";

// Interface for a Job Data Transfer Object (DTO)
export interface JobDto{
    job_id: number; // Unique identifier for the job
    job_title: string; // Title of the job position
    job_description: string; // Detailed description of the job
    created_at: Date; // Date and time when the job was created
    status_id: number; // Foreign key for the job's status
    status: Jobs_StatusDto; // Object containing job status details
}

export interface JobDtoCandidate{
    job_id: number;
    job_title: string;
}

export interface ListAllJobsDto{
    job_id: number; // Unique identifier for the job
    job_title: string; // Title of the job position
    job_description: string; // Detailed description of the job
    created_at: Date; // Date and time when the job was created
    status_id: number; // Foreign key for the job's status
    status: ListAllJobs_Status; // Name of the job status
    scheduled: string;
}

export interface CreateNewJobDto {
  job_title: string;
  job_description: string;
  created_by: string;
  jobs_Skills: JobSkillDto[];

  status: {
    status: string;
    reason: string;
    changed_by: string;
  };
}

export interface JobSkillDto {
  job_id: number;       
  skill_id: number; 
  skill_type: string; 
}

export interface UpdateJobDto extends CreateNewJobDto{
  job_id: number;
}

export interface ListJobStatusDto{
  job_title: string;
  status: Jobs_Status_ListJobStatusDto;
}

export interface ShowJobTitleDto{
  job_title: string;
}

export type JobInfoForCandidateDto = UpdateJobDto;
export type ListOpenJobsForCandidateDto = ListAllJobsDto;