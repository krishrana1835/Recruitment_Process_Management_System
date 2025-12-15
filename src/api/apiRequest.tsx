
const api_url = import.meta.env.VITE_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  token: string,
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${api_url}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      console.error(result)
      throw new Error(result.message || "Request failed");
    }

    return result.data as T;
  } catch (error: any) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw new Error(error.message || "Network error");
  }
}