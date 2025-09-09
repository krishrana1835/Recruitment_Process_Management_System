import type { Roles } from "../interfaces/Roles_interface";
const api_url = import.meta.env.VITE_API_URL

export async function getRoles(): Promise<Roles[]> {
  try {
    const response = await fetch(api_url + "/Role", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching roles failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error while fetching roles");
  }
}
