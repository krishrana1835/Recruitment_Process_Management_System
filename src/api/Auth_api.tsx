// services/authService.ts
// Import necessary interfaces for user login and login response
import type { UserLoginDto, LoginResponse } from "../interfaces/Auth_interface";

// API base URL from environment variables
const api_url = import.meta.env.VITE_API_URL;

/**
 * Handles user login by sending credentials to the authentication API.
 * @param data - The user's login credentials (email and password).
 * @returns A promise that resolves to a LoginResponse object containing authentication tokens.
 * @throws An error if the login request fails or the response is not OK.
 */
export async function loginUser(data: UserLoginDto): Promise<LoginResponse> {
  // Make a POST request to the login endpoint
  const response = await fetch(api_url + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify content type as JSON
    },
    body: JSON.stringify(data), // Send the login data as a JSON string in the request body
  });

  // Check if the request was successful
  if (!response.ok) {
    // If the response is not OK, read the error message from the response body
    const errorText = await response.text();
    // Throw an error with the specific message or a generic one if none is provided
    throw new Error(errorText || "Login failed");
  }

  const returndata = response.json();
  // If the request was successful, parse the JSON response and return it
  return returndata;
}
