// Import the RoleDto interface from the Roles_interface file
import type { SkillDto } from "@/interfaces/Skill_interrface";
import { apiRequest } from "./apiRequest";

// Get the API URL from environment variables
const api_url = import.meta.env.VITE_API_URL

/**
 * Fetches all roles from the API.
 * @returns A promise that resolves to an array of RoleDto objects.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getSkills(): Promise<SkillDto[]> {
  try {
    // Make a GET request to the roles endpoint
    const response = await fetch(api_url + "/Skill", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      // If not successful, read the error text and throw an error
      const errorText = await response.text();
      throw new Error(errorText || "Fetching skills failed");
    }

    // Parse the JSON response
    const data = await response.json();
    return data; // Return the fetched roles
  } catch (error) {
    // Catch any network errors and throw a new error
    throw new Error("Network error while fetching skills");
  }
}

/**
 * Assign multiple skills to a candidate
 * @param candidateId - ID of the candidate
 * @param skillIds - Array of skill IDs (numbers)
 * @param token - Bearer token for authentication
 */
export async function assignSkillsToCandidate(
  candidateId: string,
  skillIds: number[],
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Skill/AddCandidateSkills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        skill_ids: skillIds,
      }),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = "Failed to fetch jobs";
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error assigning skills:", error);
    throw new Error("Network error while assigning skills");
  }
}

/**
 * Assign multiple skills to a candidate
 * @param candidateId - ID of the candidate
 * @param skillIds - Array of skill IDs (numbers)
 * @param token - Bearer token for authentication
 */
export async function assignSkillsToCandidateInRegistration(
  candidateId: string,
  skillIds: number[],
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Skill/Register/AddCandidateSkills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        skill_ids: skillIds,
      }),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = "Failed to assign skills";
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error assigning skills:", error);
    throw new Error("Network error while assigning skills");
  }
}


/**
 * Add new Skill into database
 * @param data - add skill to add
 * @param token - Bearer token for authontication
 * @returns - Array of Skills with it's Id
 */
export function addSkillApi(data: string, token: string) {
  return apiRequest<SkillDto[]>(`/Skill/AddSkill/${data}`, "GET", token);
}

/**
 * Update Skill in database
 * @param data - {skill_id, skill_name}
 * @param token - Bearer token for authontication
 * @returns - Updated Skill with it's Id
 */
export function updateSkillApi(data: SkillDto, token: string) {
  return apiRequest<SkillDto>(`/Skill/UpdateSkill`, "POST", token, data);
}

/**
 * Delete Skill in database
 * @param data - Skill Id
 * @param token - Bearer token for authontication
 * @returns - Updated Skill with it's Id
 */
export function deleteSkillApi(data: number, token: string) {
  return apiRequest<SkillDto>(`/Skill/DeleteSkill/${data}`, "DELETE", token);
}