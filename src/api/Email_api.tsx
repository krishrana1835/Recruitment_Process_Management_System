/**
 * Represents the structure of an email object.
 * @interface Email
 * @property {string} toEmail - The recipient's email address.
 * @property {string} subject - The subject of the email.
 * @property {string} body - The body content of the email.
 */
interface Email{
    toEmail: string,
    subject: string,
    body: string,
}

const api_url = import.meta.env.VITE_API_URL;

/**
 * Sends an email using the API.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body content of the email.
 * @param {string} token - The authentication token for the API request.
 * @returns {Promise<any>} A promise that resolves with the response from the API.
 * @throws {Error} Throws an error if the API request fails or if the response is not successful.
 */
export async function sendMail(to: string, subject: string, body: string, token: string): Promise<any> {

    const email: Email = {
        toEmail: to,
        subject: subject,
        body: body,
    }

  const response = await fetch(api_url + "/Email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Email not sent");
  }

  return response.json();
}