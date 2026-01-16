import type { SelectedCandidatesDto } from "@/interfaces/Candidate_interface";
import { apiRequest } from "./apiRequest";

export interface UpdateDocVerification{
  document_id: number;
  verification_status: string;
  job_id: number;
  user_id: string;
}

export function GetSelectedCandidates(data: number, token: string) {
  return apiRequest<SelectedCandidatesDto[]>(`/Interview/GetSelectedCandidates?job_id=${data}`, "GET", token);
}

export function UpdateVerificationStatus(data: UpdateDocVerification, token: string){
  return apiRequest<any>(`/Candidate_Documents/UpdateVerificationStatus`, "PUT", token, data);
}