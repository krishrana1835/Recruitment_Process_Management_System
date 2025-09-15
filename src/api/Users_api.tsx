import type { UserInfo, UsersList } from "@/interfaces/User_interface";

const api_url = import.meta.env.VITE_API_URL;

const user = sessionStorage.getItem("user");
const token = user ? JSON.parse(user).token : null;

export async function getUsersInfo(): Promise<UsersList[]> {
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
    console.log(transformedData);
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching roles");
  }
}

export async function getUserData(id: string): Promise<UserInfo> {
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
    const transformedData: UserInfo = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      role: Array.isArray(data.roles) ? data.roles : [],
      created_at: new Date(data.created_at),
    };
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching roles");
  }
}

export async function updateUserData(id: string, data: Partial<UserInfo>): Promise<void> {
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