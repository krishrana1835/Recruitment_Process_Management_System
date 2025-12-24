import type { SelectedCandidatesDto } from "@/interfaces/Candidate_interface";
import { apiRequest } from "./apiRequest";

export function GetSelectedCandidates(data: number, token: string) {
  return apiRequest<SelectedCandidatesDto[]>(`/Interview/GetSelectedCandidates/${data}`, "GET", token);
}

export function UpdateVerificationStatus(data: {document_id: number, verification_status: string}, token: string){
  return apiRequest<any>(`/Candidate_Documents/UpdateVerificationStatus`, "POST", token, data);
}