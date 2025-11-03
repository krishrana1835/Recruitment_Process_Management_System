import type { CandidateStatus } from "@/interfaces/Candidate_Status_History_interface";

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

export async function sendStatusEmail(
  candidateEmail: string,
  status: keyof typeof CandidateStatus,
  token: string
): Promise<any> {

  // Map status to email subject and body
  const statusMessages: Record<keyof typeof CandidateStatus, { subject: string; body: string }> = {
    Applied: {
      subject: "Roima - Application Received",
      body: "Thank you for applying. We have received your application and will review it shortly."
    },
    Shortlisted: {
      subject: "Roima - You are Shortlisted",
      body: "Congratulations! You have been shortlisted for the next round of our hiring process."
    },
    InterviewScheduled: {
      subject: "Roima - Interview Scheduled",
      body: "Your interview has been scheduled. Please check your account for details."
    },
    InterviewCompleted: {
      subject: "Roima - Interview Completed",
      body: "Thank you for completing the interview. We will get back to you with the results soon."
    },
    OnHold: {
      subject: "Roima - Application On Hold",
      body: "Your application is currently on hold. We will notify you once there is an update."
    },
    Accepted: {
      subject: "Roima - Application Accepted",
      body: "Congratulations! Your application has been accepted. We will share further details shortly."
    },
    Rejected: {
      subject: "Roima - Application Status Update",
      body: "We regret to inform you that your application was not successful. We appreciate your interest."
    },
    Hired: {
      subject: "Roima - Welcome Aboard!",
      body: "Congratulations! You have officially joined our team. We are excited to have you."
    }
  };

  // Get the message for the given status
  const message = statusMessages[status];

  if (!message) {
    throw new Error("Invalid candidate status");
  }

  // Send email using your existing sendMail function
  return sendMail(candidateEmail, message.subject, message.body, token);
}
