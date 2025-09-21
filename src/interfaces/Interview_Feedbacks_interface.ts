// Interface for an Interview Feedback Data Transfer Object (DTO)
export interface Interview_FeedbackDto{
    feedback_id: number; // Unique identifier for the interview feedback
    rating: number; // Rating given during the interview feedback
    comments: string; // Comments or notes from the interview feedback
    feedback_at: Date; // Date and time when the feedback was provided
    interview_id: number; // Identifier for the interview this feedback belongs to
    skill_id: number; // Identifier for the skill related to this feedback
}
