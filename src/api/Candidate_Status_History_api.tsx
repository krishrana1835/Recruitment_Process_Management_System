import type { CandidateListDto } from "@/interfaces/Candidate_interface";
import { type ApplyForJobByCandidateDto, type ChangeCandidateStatusDto, type ListJobApplicationStatus } from "@/interfaces/Candidate_Status_History_interface";
import { sendStatusEmail } from "./Email_api";

const api_url = import.meta.env.VITE_API_URL;

export async function checkAppliedForJob(
  payload: ApplyForJobByCandidateDto,
  token: string
): Promise<{ applied: boolean }> {
  try {
    const response = await fetch(`${api_url}/Candidate_Status_History/CheckApplication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Error while checking job application status"
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Network error while chacking job application status"
    );
  }
}

export async function getJobApplications(
  candidate_id: string, 
  token: string
): Promise<ListJobApplicationStatus[]> {
  try {
    const response = await fetch(`${api_url}/Candidate_Status_History/GetApplications/${candidate_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Error while fetching applications"
      );
    }

    const data = await response.json();
    return data.applications;
  } catch (error: any) {
    throw new Error(
      error.message || "Network error while fetching applications"
    );
  }
}

export async function getAllJobApplications(
  job_id: number,
  token: string
): Promise<CandidateListDto[]> {
  try {
    const response = await fetch(`${api_url}/Candidate_Status_History/GetJobApplications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Error while fetching applications"
      );
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (error: any) {
    console.error(error)
    throw new Error(
      error.message || "Network error while fetching applications"
    );
  }
}

export async function applyForJobByCandidate(
  payload: ApplyForJobByCandidateDto,
  email: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Candidate_Status_History`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error applieng for job");
    }

    try{
      await sendStatusEmail(email, "Applied",token)
    }catch(error: any){
      console.error(error)
      throw new Error(error.message || "Error sending email");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error while applyling for job");
  }
}

export async function updateCandidateStatus(
  payload: ChangeCandidateStatusDto,
  email:string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Candidate_Status_History/UpdateCandidateStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error updating job status");
    }

    try{
      await sendStatusEmail(email,payload.status,token)
    }catch(error: any){
      console.error(error)
      throw new Error(error.message || "Error sending email");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message || "Error updating job status");
  }
}