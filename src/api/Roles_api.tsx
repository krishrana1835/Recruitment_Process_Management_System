// Import the RoleDto interface from the Roles_interface file
import type { RoleDto } from "../interfaces/Roles_interface";

// Get the API URL from environment variables
const api_url = import.meta.env.VITE_API_URL

/**
 * Fetches all roles from the API.
 * @returns A promise that resolves to an array of RoleDto objects.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getRoles(): Promise<RoleDto[]> {
  try {
    // Make a GET request to the roles endpoint
    const response = await fetch(api_url + "/Role", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      // If not successful, read the error text and throw an error
      const errorText = await response.text();
      throw new Error(errorText || "Fetching roles failed");
    }

    // Parse the JSON response
    const data = await response.json();
    return data; // Return the fetched roles
  } catch (error) {
    // Catch any network errors and throw a new error
    throw new Error("Network error while fetching roles");
  }
}