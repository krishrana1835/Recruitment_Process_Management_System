import type { CandidateDocumentDto } from "./Candidate_Documents_interface";
import type { Candidate_ReviewDto } from "./Candidate_Review_interface";
import type { CandidateStatusHistoryDto } from "./Candidate_Status_History_interface";
import type { InterviewDtoCandidate } from "./Interview_interface";
import type { SkillDto } from "./Skill_interrface";

export interface CandidateDto {
  candidate_id: string;
  full_name: string;
  email: string;
}

export interface CandidateListDto extends CandidateDto {
  phone: string;
  created_at: Date;
}

export interface CreateCandidateDto extends CandidateDto {
  phone: string;
  resume_path: string;
  password: string;
}

export interface UpdateBulkCandidate extends CandidateDto {
  phone: string;
  resume_path: string;
}

export interface CreateBulkCandidate {
  full_name: string;
  email: string;
  phone: string;
  resume_path: string;
}

export interface DeleteBulkCandidate {
  candidate_id: string;
}

export interface candidateSkills {
  candidate_skill_id: number;
  years_experience: number;
  skill_id: number;
  candidate_id: string;
  skill: SkillDto;
}

export interface CandidateProfileDto {
  candidate_id: string;
  full_name: string;
  email: string;
  phone?: string;
  resume_path: string;
  created_at: Date;
  status: string;
  candidate_Documents: CandidateDocumentDto[];
  candidate_Reviews: Candidate_ReviewDto[];
  candidate_Skills: candidateSkills[];
  candidate_Status_Histories: CandidateStatusHistoryDto[];
  interviews: InterviewDtoCandidate[];
}
