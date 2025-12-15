// Import necessary types from various interfaces and components
import type { LastId } from "@/components/custom/AddUser";
import type { RoleDto } from "@/interfaces/Roles_interface";
import type {
  ResetUserPasswordDto,
  UserCreateDto,
  UserDashboardProfileData,
  UserInfoDto,
  UserProfileDto,
  UsersList,
  UserUpdateDto,
} from "@/interfaces/User_interface";
import { sendMail } from "@/api/Email_api";
import { apiRequest } from "./apiRequest";

// Get the API URL from environment variables
const api_url = import.meta.env.VITE_API_URL;

/**
 * Fetches information for all users.
 * @param token - The authentication token.
 * @returns A promise that resolves to an array of UsersList objects.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getUsersInfo(token: string): Promise<UsersList[]> {
  try {
    // Make a GET request to the GetUserInfo endpoint
    const response = await fetch(`${api_url}/Users/GetUserInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the authorization token
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching Users info failded");
    }

    // Parse the JSON response
    const data = await response.json();
    // Transform the raw data into the UsersList format
    const transformedData: UsersList[] = data.map((user: any) => ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: Array.isArray(user.roles) ? user.roles : [], // Ensure roles is an array
    }));
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching user info");
  }
}

/**
 * Fetches the last user ID.
 * @param token - The authentication token.
 * @returns A promise that resolves to a LastId object.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getLastUserId(token: string): Promise<LastId> {
  try {
    // Make a GET request to the GetLastUserId endpoint
    const response = await fetch(`${api_url}/Users/GetLastUserId`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching Users info failded");
    }

    // Parse the JSON response and return it
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error while fetching user info");
  }
}

/**
 * Fetches detailed data for a specific user.
 * @param id - The ID of the user to fetch.
 * @param token - The authentication token.
 * @returns A promise that resolves to a UserInfoDto object.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getUserData(
  id: string,
  token: string
): Promise<UserInfoDto> {
  try {
    // Make a GET request to the user-specific endpoint
    const response = await fetch(`${api_url}/Users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching User Data failded");
    }

    // Parse the JSON response
    const data = await response.json();
    // Transform the raw data into the UserInfoDto format
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

/**
 * Fetches the profile data for a specific user.
 * @param id - The ID of the user whose profile to fetch.
 * @param token - The authentication token.
 * @returns A promise that resolves to a UserProfileDto object.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function getUserProfile(
  id: string,
  token: string
): Promise<UserProfileDto> {
  try {
    // Make a GET request to the user profile endpoint
    const response = await fetch(`${api_url}/Users/GetUserProfile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Fetching User Profile Data failded");
    }

    // Parse the JSON response
    const data = await response.json();
    // Transform the raw data into the UserProfileDto format
    const transformedData: UserProfileDto = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      role: Array.isArray(data.roles) ? data.roles : [],
      created_at: new Date(data.created_at),
      interview_feedbacks: Array.isArray(data.interview_feedbacks)
        ? data.interview_feedbacks
        : [],
      candidate_reviews: Array.isArray(data.candidate_reviews)
        ? data.candidate_reviews
        : [],
      jobs_created: Array.isArray(data.jobs_created) ? data.jobs_created : [],
    };
    return transformedData;
  } catch (error) {
    throw new Error("Network error while fetching user profile data");
  }
}

export async function getUserProfileData(
  id: string,
  token: string
): Promise<UserDashboardProfileData> {
  try {
    // Make a PUT request to update user data
    const response = await fetch(`${api_url}/Users/GetUserProfileToUpdate/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error in fetching user profile data");
    }

    return response.json();
  } catch (error) {
    throw new Error("Network error while fetching user data");
  }
}


/**
 * Updates partial user data for a specific user.
 * @param id - The ID of the user to update.
 * @param data - The partial user data to update.
 * @param token - The authentication token.
 * @returns A promise that resolves when the update is complete.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function updateUserData(
  id: string,
  data: Partial<UserInfoDto>,
  token: string
): Promise<void> {
  try {
    // Make a PUT request to update user data
    const response = await fetch(`${api_url}/Users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Send the updated data as a JSON string
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Updating User Data failed");
    }
  } catch (error) {
    throw new Error("Network error while updating user data");
  }
}

/**
 * Creates a new user.
 * @param newUser - The data for the new user.
 * @param roles - An array of RoleDto objects to assign to the new user.
 * @param token - The authentication token.
 * @returns A promise that resolves to the API response for the created user.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function createUser(
  newUser: UserCreateDto,
  roles: RoleDto[],
  token: string
): Promise<any> {
  try {
    // Make a POST request to add a new user
    const response = await fetch(`${api_url}/Users/AddUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newUser,
        roles, // Attach roles directly to the main object
      }),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Creating user failed");
    }

    // Parse the JSON response and return it
    return await response.json();
  } catch (error: any) {
    throw new Error(error?.message ||"Network error while creating user");
  }
}

/**
 * Updates an existing user.
 * @param updatedUser - The data for the updated user.
 * @param roles - An array of RoleDto objects to assign to the updated user.
 * @param token - The authentication token.
 * @returns A promise that resolves to the API response for the updated user.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function updateUser(
  updatedUser: UserUpdateDto,
  roles: RoleDto[],
  token: string
): Promise<any> {
  // Combine updated user data and roles into a single payload
  const payload = { ...updatedUser, roles };

  try {
    // Make a PUT request to update user data
    const response = await fetch(`${api_url}/Users/UpdateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // Send the combined payload as a JSON string
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Updating user failed");
    }

    // Parse the JSON response and return it
    return await response.json();
  } catch (error: any) {
    throw new Error(error?.message || "Network error while updating user");
  }
}

/**
 * Deletes a user.
 * @param id - The ID of the user to delete.
 * @param token - The authentication token.
 * @returns A promise that resolves when the deletion is complete.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function deleteUser(id: string, token: string): Promise<void> {
  try {
    // Make a DELETE request to delete a user
    const response = await fetch(`${api_url}/Users/DeleteUser/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }, // Include the authorization token
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Deleting user failed");
    }
    // Parse the JSON response and return it (if any)
    return await response.json();
  } catch (error) {
    throw new Error("Network error while deleting user");
  }
}

export async function resetUserPassword(
  payload: ResetUserPasswordDto,
  token: string
): Promise<{success: boolean; message: string}> {
  try {
    const response = await fetch(`${api_url}/Users/UpdatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "updating user password failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating user password:", error);
    throw new Error(error?.message || "Network error while updating user password");
  }
}

export async function UpdateUserDashProfile(
  payload: UserDashboardProfileData,
  email: string,
  token: string
): Promise<UserDashboardProfileData> {
  try {
    const response = await fetch(
      `${api_url}/Users/UpdateProfile`,
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
      throw new Error(errorText || "updating user profile failed");
    }

    try {
      await sendMail(
        email,
        "Roima User Profile Updated",
        `
        <p>Your profile has been updated. This is the user information:</p>
        <p>
          <b>Name:</b> ${payload.name}<br>
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
    console.error("Error updating user profile", error);
    throw new Error(
      error?.message || "Network error while updating user profile"
    );
  }
}

export function getAllInterviewers(token: string) {
  return apiRequest<any>("/Users/GetInterviewers", "GET", token);
}