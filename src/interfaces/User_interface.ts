import type { Candidate_ReviewDto } from "./Candidate_Review_interface";
import type { Interview_FeedbackDto } from "./Interview_Feedbacks_interface";
import type { JobDto } from "./Jobs_interface";
import type { RoleDto } from "./Roles_interface";

export interface UserDto{
    user_id: string;
    name: string;
    email: string;
}

export interface UsersList extends UserDto{
    role: RoleDto[];
}

export interface UserInfoDto extends UserDto{
    role: RoleDto[];
    created_at: Date;
}

export interface UserProfileDto extends UserDto{
    role: RoleDto[];
    created_at: Date;
    interview_feedbacks: [Interview_FeedbackDto];
    candidate_reviews: [Candidate_ReviewDto];
    jobs_created: [JobDto];
}