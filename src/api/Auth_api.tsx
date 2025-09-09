// services/authService.ts
import type { UserLoginDto, LoginResponse } from "../interfaces/Auth_interface";
const api_url = import.meta.env.VITE_API_URL

export async function loginUser(data: UserLoginDto): Promise<LoginResponse> {
  const response = await fetch(api_url+"/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return response.json();
}
