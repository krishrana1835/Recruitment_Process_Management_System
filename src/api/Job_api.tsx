import type { CreateNewJobDto, ListAllJobsDto, UpdateJobDto } from "@/interfaces/Jobs_interface";

// Get the API URL from environment variables
const api_url = import.meta.env.VITE_API_URL

export async function getAllJobs(token: string): Promise<ListAllJobsDto[]> {
  try {
    const response = await fetch(api_url + "/Job", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // if needed
      },
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
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    throw new Error(error.message || "Network error while fetching jobs");
  }
}

export async function createJob(
  data: CreateNewJobDto,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = `Failed to create job (Status: ${response.status})`;
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.details || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error creating job:", error);
    throw new Error(error.message || "Network error while creating job");
  }
}

export async function updateJob(
  data: UpdateJobDto,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Job`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = `Failed to update job (Status: ${response.status})`;
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.details || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error updating job:", error);
    throw new Error(error.message || "Network error while updating job");
  }
}

export async function getJob(
  job_id: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Job/${job_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = `Failed to fetch job (Status: ${response.status})`;
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.details || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching job:", error);
    throw new Error(error.message || "Network error while fetching job");
  }
}

export async function deleteJob(
  job_id: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${api_url}/Job/${job_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let errorMessage = `Failed to delete job (Status: ${response.status})`;
      try {
        const errorData = JSON.parse(bodyText);
        errorMessage = errorData.details || errorMessage;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error deleting job:", error);
    throw new Error(error.message || "Network error while deleting job");
  }
}