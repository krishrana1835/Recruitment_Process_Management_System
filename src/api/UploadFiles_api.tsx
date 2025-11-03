const api_url = import.meta.env.VITE_API_URL;

/**
 * Uploads a candidate's resume to the server.
 *
 * @param {File} file - The resume file to upload.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<{ success: boolean; url?: string; message?: string }>}
 * A promise that resolves with the upload result.
 * @throws {Error} Throws an error if the API request fails or the network request fails.
 */
export async function uploadResume(
  file: File,
  token: string
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${api_url}/FileUpload/CandidateResume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text(); // Try reading plain error
    throw new Error(errorText || "Failed to upload resume");
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    return await response.json(); // ✅ safe to parse
  } else {
    throw new Error("Invalid response type from server");
  }
}

export async function uploadDocument(
  file: File,
  candidate_id: string,
  type: string,
  token: string
): Promise<{ success: boolean; url: string }> {
  const formData = new FormData();
  formData.append("foldername", candidate_id);
  formData.append("File", file);

  let uploadUrl = "";

  switch (type) {
    case "Aadhar Card":
    case "Aadhar":
      uploadUrl = `${api_url}/FileUpload/CandidateAadhar`;
      break;

    case "PAN Card":
    case "Pan":
      uploadUrl = `${api_url}/FileUpload/CandidatePan`;
      break;

    case "College Results":
    case "College":
      uploadUrl = `${api_url}/FileUpload/CandidateCollegeResults`;
      break;

    case "HSC/SSC Result":
    case "HSC/SSC":
      uploadUrl = `${api_url}/FileUpload/CandidateHscOrSscResult`;
      break;

    default:
      throw new Error(`Unknown document type: ${type}`);
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to upload ${type}`);
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  } else {
    throw new Error("Invalid response type from server");
  }
}

export async function deleteDocuent(
  resume_path: string,
  token: string
): Promise<any> {
  const payload = { resume_path: resume_path };
  try {
    const response = await fetch(`${api_url}/FileUpload/RemoveDocument`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete document");
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network error while deleting document");
  }
}


export async function deleteCandidateResume(
  resume_path: string,
  token: string
): Promise<any> {
  const payload = { resume_path: resume_path };
  try {
    const response = await fetch(`${api_url}/FileUpload/CandidateResume`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete resume");
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network error while deleting resume");
  }
}

export async function analizeResume(
  file: File,
  token: string
): Promise<{ name: string; email: string; phone: string; skills: string[] }> {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${api_url}/Resume/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload resume");
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  } else {
    throw new Error("Invalid response type from server");
  }
}
