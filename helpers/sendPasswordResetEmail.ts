import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendPasswordResetEmail(
    email: string,
    username: string,
    resetCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Mystry Message <verification@verify.ashulabs.dev>',
            to: email,
            subject: 'Mystry Message | Password reset code',
            react: VerificationEmail({ username, otp: resetCode })
        })
        return { success: true, message: 'Password reset email sent successfully' }
    } catch (emailError) {
        console.error("Error sending password reset email", emailError);
        return { success: false, message: 'Failed to send password reset email' }
    }
}