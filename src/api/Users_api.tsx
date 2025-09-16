import type { UserInfoDto, UserProfileDto, UsersList } from "@/interfaces/User_interface";

const api_url = import.meta.env.VITE_API_URL;

export async function getUsersInfo(token: string): Promise<UsersList[]> {
  try {
    const response = await fetch(`${api_url}/Users/GetUserInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching Users info failded");
    }
    const data = await response.json();
    const transformedData: UsersList[] = data.map((user: any) => ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: Array.isArray(user.roles) ? user.roles : [],
    }));
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching user info");
  }
}

export async function getUserData(id: string, token: string): Promise<UserInfoDto> {
  try {
    const response = await fetch(`${api_url}/Users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching User Data failded");
    }
    const data = await response.json();
    const transformedData: UserInfoDto = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      role: Array.isArray(data.roles) ? data.roles : [],
      created_at: new Date(data.created_at),
    };
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching user data");
  }
}

export async function getUserProfile(id: string, token: string): Promise<UserProfileDto> {
  try {
    const response = await fetch(`${api_url}/Users/GetUserProfile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching User Profile Data failded");
    }
    const data = await response.json();
    const transformedData: UserProfileDto = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      role: Array.isArray(data.roles) ? data.roles : [],
      created_at: new Date(data.created_at),
      interview_feedbacks: Array.isArray(data.interview_feedbacks) ? data.interview_feedbacks : [],
      candidate_reviews: Array.isArray(data.candidate_reviews) ? data.candidate_reviews : [],
      jobs_created: Array.isArray(data.jobs_created) ? data.jobs_created : [],
    }
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching user profile data");
  }
}

export async function updateUserData(id: string, data: Partial<UserInfoDto>, token: string): Promise<void> {
  try {
    const response = await fetch(`${api_url}/Users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Updating User Data failed");
    }
  } catch (error) {
    throw new Error("Network error while updating user data");
  }
}