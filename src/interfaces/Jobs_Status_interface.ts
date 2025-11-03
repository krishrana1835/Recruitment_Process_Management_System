// Interface for a Job Status Data Transfer Object (DTO)
export interface Jobs_StatusDto{
    status_id: number; // Unique identifier for the job status
    status: string; // The status itself (e.g., "Open", "Closed", "On Hold")
    reason: string; // Reason for the current status
    changed_at: Date; // Date and time when the status was last changed
    changed_by: string; // User who last changed the status
}

export interface ListAllJobs_Status{
    status_id: number; // Unique identifier for the job status
    status: string; // The status itself (e.g., "Open", "Closed", "On Hold")
}

export interface Jobs_Status_ListJobStatusDto{
    status: string;
}