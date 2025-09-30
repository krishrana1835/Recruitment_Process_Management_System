export interface CandidateStatusHistoryDto {
    candidate_status_id: number;
    status: string;
    reason: string;
    changed_at: Date;
}
