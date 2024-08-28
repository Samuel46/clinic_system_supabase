import InvitationEmail from "@config/invite-users";
import ResetPasswordEmail from "@config/reset-password";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendResetEmail(
  email: string,
  token: string | undefined
): Promise<boolean> {
  let url: string;

  if (process.env.NODE_ENV === "production") {
    url = `https://clinic-system-henna.vercel.app/auth/reset?token=${token}&email=${email}`;
  } else {
    url = `http://localhost:3000/auth/reset?token=${token}&email=${email}`;
  }
  try {
    const emailSent = await resend.emails.send({
      from: "HealthSpace <oboarding@lyrehub.online>",
      to: [`${email}`],
      subject: "Password Reset Request",
      react: ResetPasswordEmail({ url }) as React.ReactElement,
    });
    console.log(emailSent, "email sent resend!!!!");
    return true;
  } catch (error) {
    return false;
  }
}

export const sendInvitationEmail = async (email: string, token: string, name: string) => {
  let url: string;

  if (process.env.NODE_ENV === "production") {
    url = `https://clinic-system-henna.vercel.app/auth/register?token=${token}`;
  } else {
    url = `http://localhost:3000/auth/register?token=${token}`;
  }

  try {
    const newAccess = await resend.emails.send({
      from: "HealthSpace <oboarding@lyrehub.online>",
      to: [email],
      subject: `Welcome Aboard!`,
      react: InvitationEmail({ url, name }) as React.ReactElement,
    });

    console.log(newAccess, "email sent resend!!!!");

    return newAccess;
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw new Error("Failed to send invitation email");
  }
};
