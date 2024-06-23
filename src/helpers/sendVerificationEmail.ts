import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmaiTemplate";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "AI Message <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (emailError) {
    console.log(emailError, "Email error");
    return { success: false, message: "Failed to send verification email" };
  }
}
