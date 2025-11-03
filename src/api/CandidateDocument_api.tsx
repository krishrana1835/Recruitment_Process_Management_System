import type { CandidateDocumentDto, UploadCandidateDocuments } from "@/interfaces/Candidate_Documents_interface";

const api_url = import.meta.env.VITE_API_URL;

export async function getCandidateDocuments(
  candidate_id: string,
  token: string
): Promise<CandidateDocumentDto[]> {
  try {
    const response = await fetch(`${api_url}/Candidate_Documents/${candidate_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error while fetching candidate document");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error while fetching candidate document");
  }
}

export async function uploadCandidateDocuments(
  payload: UploadCandidateDocuments,
  token: string
): Promise<CandidateDocumentDto> {
  try {
    const response = await fetch(`${api_url}/Candidate_Documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error while adding candidate document");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error while adding candidate document");
  }
}