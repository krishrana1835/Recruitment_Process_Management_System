import type { EmployeeRecordInsert } from "@/tabs/CompanyDashboard/HR/EmployeeCandidates";
import { apiRequest } from "./apiRequest";
import type { SelectedCandidatesDto } from "@/interfaces/Candidate_interface";
import type { EmployeeList, UpdateEmployeeDto } from "@/tabs/CompanyDashboard/HR/ManageEmployees";
import type { OfferData } from "@/tabs/CompanyDashboard/Candidate/OfferLetterAndJoining";

export function AddEmployee(data:EmployeeRecordInsert , token: string) {
  return apiRequest<any>(`/EmployeeRecord/AddEmployee`, "POST", token, data);
}

export function GetEmployees(data: Number , refreshKey: number, token: string) {
  return apiRequest<EmployeeList[]>(`/EmployeeRecord/FetchEmployees?job_id=${data}`, "GET", token);
}

export function GetEmployeeCandidates(data: Number , refereshKey: number, token: string) {
  return apiRequest<SelectedCandidatesDto[]>(`/EmployeeRecord/GetSelectedCandidates?job_id=${data}`, "GET", token);
}

export function Isemployee(data: string , token: string) {
  return apiRequest<boolean>(`/EmployeeRecord/IsEmployee?CandidateId=${data}`, "GET", token);
}

export function GetOfferLatterAndJoiningDate(data: string , token: string) {
  return apiRequest<OfferData>(`/EmployeeRecord/GetOfferlatter?CandidateId=${data}`, "GET", token);
}

export function UpdateEmployee(data: UpdateEmployeeDto , token: string) {
  return apiRequest<any>(`/EmployeeRecord/UpdateEmployee`, "PUT", token, data);
}

export function DeleteEmployee(data: number , token: string) {
  return apiRequest<any>(`/EmployeeRecord/DeleteEmployee?EmployeeId=${data}`, "DELETE", token);
}