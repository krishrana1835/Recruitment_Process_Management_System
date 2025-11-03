import type {
  CandidateListDto,
  CreateCandidateDto,
  DeleteBulkCandidate,
  UpdateBulkCandidate,
  CandidateProfileDto,
  RegisterCandidateDto,
  UploadCandidateResumeDto,
  ResetCandidatePasswordDto,
} from "@/interfaces/Candidate_interface";
import { sendMail } from "./Email_api";
import type { CandidateDashboardProfileData } from "@/tabs/CompanyDashboard/Candidate/Profile";

const api_url = import.meta.env.VITE_API_URL;

/**
 * Fetches a list of all candidates from the API.
 *
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<CandidateListDto[]>} A promise that resolves to an array of candidate objects.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function getCandidateList(
  token: string
): Promise<CandidateListDto[]> {
  try {
    const response = await fetch(`${api_url}/Candidate/GetCandidateList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error fetching candidates list");
    }

    const data = await response.json();
    return data as CandidateListDto[];
  } catch (error) {
    throw new Error("Network error while fetching candidates list");
  }
}

/**
 * Fetches the profile of a specific candidate by their ID.
 *
 * @param {string} id - The unique identifier of the candidate.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<CandidateProfileDto>} A promise that resolves to the candidate's profile data.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function getCandidateProfile(
  id: string,
  token: string
): Promise<CandidateProfileDto> {
  try {
    const response = await fetch(
      `${api_url}/Candidate/GetCandidateProfile/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error fetching candidate profile");
    }

    const data = await response.json();
    return data as CandidateProfileDto;
  } catch (error) {
    throw new Error("Network error while fetching candidate profile");
  }
}

export async function getCandidateDashProfile(
  id: string,
  token: string
): Promise<CandidateDashboardProfileData> {
  try {
    const response = await fetch(
      `${api_url}/Candidate/GetCandidateDashboardProfile/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error fetching candidate profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error while fetching candidate profile");
  }
}

/**
 * Fetches the ID of the last candidate created in the system.
 *
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<any>} A promise that resolves to the ID of the last candidate.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function getLastCandidateId(token: string): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Candidate/GetLastCandidateId`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error fetching lasst candidate id");
    }

    const data = await response.json();
    return data.candidate_id;
  } catch (error) {
    throw new Error("Network error while fetching last candidate id");
  }
}

export async function getCandidateResume(
  candidate_id: string,
  token: string
): Promise<{ message: string; resume_path: string; success: boolean }> {
  try {
    const response = await fetch(
      `${api_url}/Candidate/GetResume/${candidate_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error fetching candidate resume");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error("Network error while fetching candidate resume");
  }
}

/**
 * Creates a new candidate in the system.
 *
 * @param {CreateCandidateDto} newCandidate - The candidate data to create.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<any>} A promise that resolves to the created candidate data.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function createCandidate(
  newCandidate: CreateCandidateDto,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Candidate/AddCandidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCandidate),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Creating candidate failed");
    }

    try {
      await sendMail(
        newCandidate.email,
        "Your Candidate Profile in Roima's Dashbord has been Created.",
        `This is your temporary password "${newCandidate.password}", please do not share to anyone.`,
        token
      );
    } catch (error: any) {
      throw new Error(error?.message || "Error sending email");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error?.message || "Network error while creating candidate");
  }
}

/**
 * Registers a new candidate in the system.
 *
 * @param {CreateCandidateDto} newCandidate - The candidate data to create.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<any>} A promise that resolves to the created candidate data.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function registerCandidate(
  newCandidate: RegisterCandidateDto
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Candidate/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCandidate),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error registering candidate:", error);
    throw new Error(
      error?.message || "Network error while registering candidate"
    );
  }
}

export async function uploadResumeCandidate(
  payload: UploadCandidateResumeDto,
  token: string
): Promise<{ message: string; url: string }> {
  try {
    const response = await fetch(`${api_url}/Candidate/UploadResume`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "updating candidate resume path failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating candidate resume path:", error);
    throw new Error(
      error?.message || "Network error while updating candidate resume path"
    );
  }
}

export async function resetCandidatePassword(
  payload: ResetCandidatePasswordDto,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${api_url}/Candidate/ResetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "updating candidate password failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating candidate password:", error);
    throw new Error(
      error?.message || "Network error while updating candidate password"
    );
  }
}

export async function UpdateCandidateDashProfile(
  payload: CandidateDashboardProfileData,
  email: string,
  token: string
): Promise<CandidateDashboardProfileData> {
  try {
    const response = await fetch(
      `${api_url}/Candidate/UpdateCandidateDashboardProfile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "updating candidate profile failed");
    }

    try {
      await sendMail(
        email,
        "Roima Candidaet Profile Updated",
        `
        <p>Your profile has been updated. This is the updated information:</p>
        <p>
          <b>Name:</b> ${payload.full_name}<br>
          <b>Phone:</b> ${payload.phone}<br>
          <b>Email:</b> ${payload.email}
        </p>
      `,
        token
      );
    } catch (error: any) {
      console.error("Error sending email:", error.message);
      throw new Error("Error sending updation mail");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating candidate profile", error);
    throw new Error(
      error?.message || "Network error while updating candidate profile"
    );
  }
}

/**
 * Deletes a candidate from the system by their ID.
 *
 * @param {string} id - The unique identifier of the candidate to delete.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<void>} A promise that resolves when the candidate is successfully deleted.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function deleteCandidate(
  id: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch(`${api_url}/Candidate/DeleteCandidate/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error deleting candidate");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Network error while deleting candidate");
  }
}

/**
 * Inserts a bulk list of candidates into the system and sends a welcome email to each.
 *
 * @param {CreateCandidateDto[]} data - An array of candidate data to insert.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<string[] | string>} A promise that resolves to a list of emails that were not inserted, or a success message.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function candidateBulkInsert(
  data: CreateCandidateDto[],
  token: string
): Promise<string[] | string> {
  try {
    const response = await fetch(`${api_url}/Candidate/AddBulkCandidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Adding excel candidates failed");
    }

    const responseData: { message: string; candidate_list: string[] } =
      await response.json();

    const insertedCandidates = data.filter((candidate) =>
      responseData.candidate_list.includes(candidate.email)
    );

    const notinsertedCandidates = data.filter(
      (candidate) => !responseData.candidate_list.includes(candidate.email)
    );

    const emailOfNotInsertedCandidates = notinsertedCandidates.map(
      (candidate) => candidate.email
    );

    for (const candidate of insertedCandidates) {
      try {
        await sendMail(
          candidate.email,
          "Candidate Account Created in Roima's Dashboard",
          `Welcome ${candidate.full_name}! Your password is (${candidate.password}). Please keep it confidential.`,
          token
        );
      } catch (err: any) {
        console.error(
          `Failed to send email to ${candidate.email}:`,
          err.message
        );
      }
    }

    if (notinsertedCandidates.length > 0) return emailOfNotInsertedCandidates;
    else return responseData.message;
  } catch (error: any) {
    throw new Error(
      error?.message || "Network error while creating excel candidates"
    );
  }
}

/**
 * Updates a bulk list of candidates in the system.
 *
 * @param {UpdateBulkCandidate[]} data - An array of candidate data to update.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<string[] | string>} A promise that resolves to a list of emails that were not updated, or a success message.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function candidateBulkUpdate(
  data: UpdateBulkCandidate[],
  token: string
): Promise<string[] | string> {
  try {
    const response = await fetch(`${api_url}/Candidate/UpdateBulkCandidate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Updating candidates failed");
    }

    const responseData: { message: string; candidate_list: string[] } =
      await response.json();

    const notUpdatedCandidates = data.filter(
      (candidate) => !responseData.candidate_list.includes(candidate.email)
    );

    const emailOfNotUpdatedCandidates = notUpdatedCandidates.map(
      (candidate) => candidate.email
    );

    if (emailOfNotUpdatedCandidates.length > 0) {
      return emailOfNotUpdatedCandidates;
    } else {
      return responseData.message;
    }
  } catch (error: any) {
    throw new Error(
      error?.message || "Network error while updating candidates"
    );
  }
}

/**
 * Deletes a bulk list of candidates from the system.
 *
 * @param {DeleteBulkCandidate[]} data - An array of candidate data to delete.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<string[] | string>} A promise that resolves to a list of candidate IDs that were not deleted, or a success message.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function candidateBulkDelete(
  data: DeleteBulkCandidate[],
  token: string
): Promise<string[] | string> {
  try {
    const response = await fetch(`${api_url}/Candidate/DeleteBulkCandidate`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Deleting candidates failed");
    }

    const responseData: { message: string; candidate_list: string[] } =
      await response.json();

    const notDeletedCandidates = data.filter(
      (candidate) =>
        !responseData.candidate_list.includes(candidate.candidate_id)
    );

    const emailOfNotDeletedCandidates = notDeletedCandidates.map(
      (candidate) => candidate.candidate_id
    );

    if (emailOfNotDeletedCandidates.length > 0) {
      return emailOfNotDeletedCandidates;
    } else {
      return responseData.message;
    }
  } catch (error: any) {
    throw new Error(
      error?.message || "Network error while deleting candidates"
    );
  }
}
