// Interface for a Candidate Review Data Transfer Object (DTO)
export interface Candidate_ReviewDto{
    review_id: number; // Unique identifier for the candidate review
    comments: string; // Comments or feedback provided in the review
    reviewed_at: Date; // Date and time when the review was conducted
    candidate_id: number; // Identifier for the candidate being reviewed
    job_id: number; // Identifier for the job associated with the review
}
