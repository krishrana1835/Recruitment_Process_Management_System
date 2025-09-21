import type { Candidate_ReviewDto } from "./Candidate_Review_interface";
import type { Interview_FeedbackDto } from "./Interview_Feedbacks_interface";
import type { JobDto } from "./Jobs_interface";
import type { RoleDto } from "./Roles_interface";

// Base interface for a User Data Transfer Object (DTO)
export interface UserDto{
    user_id: string; // Unique identifier for the user
    name: string; // Name of the user
    email: string; // Email address of the user
}

// Interface for creating a new user, extends UserDto and adds a password field
export interface UserCreateDto extends UserDto{
    password: string; // Password for the new user
}

// Interface for updating an existing user, extends UserDto
export interface UserUpdateDto extends UserDto{
}

// Interface for a user in a list view, extends UserDto and includes roles
export interface UsersList extends UserDto{
    role: RoleDto[]; // Array of roles assigned to the user
}

// Interface for detailed user information, extends UserDto and includes roles and creation date
export interface UserInfoDto extends UserDto{
    role: RoleDto[]; // Array of roles assigned to the user
    created_at: Date; // Date and time when the user account was created
}

// Interface for a user profile, extends UserDto and includes roles, creation date, and related entities
export interface UserProfileDto extends UserDto{
    role: RoleDto[]; // Array of roles assigned to the user
    created_at: Date; // Date and time when the user account was created
    interview_feedbacks: [Interview_FeedbackDto]; // Array of interview feedbacks associated with the user
    candidate_reviews: [Candidate_ReviewDto]; // Array of candidate reviews associated with the user
    jobs_created: [JobDto]; // Array of jobs created by the user
}
