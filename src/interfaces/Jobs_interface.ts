import type { Jobs_StatusDto } from "./Jobs_Status_interface";

export interface JobDto{
    job_id: number;
    job_title: string;
    description: string;
    created_at: Date;
    status_id: number;
    status: Jobs_StatusDto;
}