export interface Jobs_StatusDto{
    status_id: number;
    status: string;
    reason: string;
    changed_at: Date;
    changed_by: string;
}