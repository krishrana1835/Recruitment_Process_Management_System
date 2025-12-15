import type { AddInterviewType, DeleteInterviewType, InterviewType } from "@/interfaces/InterviewType_interface";
import { apiRequest } from "./apiRequest";

export function getAllInterviewTypes(token: string) {
  return apiRequest<any>("/InterviewType", "GET", token);
}

export function addInterviewType(data: AddInterviewType, token: string) {
  return apiRequest<AddInterviewType>("/InterviewType", "POST", token, data);
}

export function updateInterviewType(data: InterviewType, token: string) {
  return apiRequest<InterviewType>("/InterviewType", "PUT", token, data);
}

export function deleteInterviewType(data: DeleteInterviewType, token: string) {
  return apiRequest<any>("/InterviewType", "DELETE", token, data);
}