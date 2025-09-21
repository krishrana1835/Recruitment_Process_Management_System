import type { Jobs_StatusDto } from "./Jobs_Status_interface";

// Interface for a Job Data Transfer Object (DTO)
export interface JobDto{
    job_id: number; // Unique identifier for the job
    job_title: string; // Title of the job position
    description: string; // Detailed description of the job
    created_at: Date; // Date and time when the job was created
    status_id: number; // Foreign key for the job's status
    status: Jobs_StatusDto; // Object containing job status details
}
