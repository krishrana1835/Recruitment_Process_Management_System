import { apiRequest } from "./apiRequest";
import type { HrReview } from "@/interfaces/Hr_review_interface";

export function addOrUpdateHrReview(data: HrReview , token: string) {
  return apiRequest<HrReview>(`/HR_Review/Add-Update`, "POST", token, data);
}
export function getHrReview(data: {interview_id: number, user_id: string} , token: string) {
  return apiRequest<HrReview>(`/HR_Review/GetReview/${data.interview_id}/${data.user_id}`, "GET", token);
}