// API base URL from environment variables
const api_url = import.meta.env.VITE_API_URL;

export async function sendOtp(email: string): Promise<any> {
  try {
    const response = await fetch(`${api_url}/EmailVerification/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ✅ Your API expects an object like { "identifier": "user@example.com" }
      body: JSON.stringify({ identifier: email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText|| "OTP generation failed");
    }

    const returndata = await response.json();
    return returndata;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message || "Network error while generating OTP");
  }
}

export async function verifyOtp(email: string, otp: string): Promise<any> {
  try {
    const response = await fetch(`${api_url}/EmailVerification/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: email, otp }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "OTP verification failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message || "Network error while verifying OTP");
  }
}