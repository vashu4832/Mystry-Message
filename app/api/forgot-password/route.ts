import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();

        const user = await UserModel.findOne({ email });

        const genericResponse = {
            success: true,
            message: "If an account with that email exists, a password reset code has been sent."
        }

        if (!user) {
            return Response.json(genericResponse, { status: 200 })
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
        user.forgotPasswordCode = resetCode
        user.forgotPasswordCodeExpiry = new Date(Date.now() + 3600000)
        await user.save()

        const emailResponse = await sendPasswordResetEmail(user.email, user.username, resetCode)

        if (!emailResponse.success) {
            console.error("Failed to send password reset email:", emailResponse.message)
        }

        return Response.json(genericResponse, { status: 200 })

    } catch (error) {
        console.error("Error in forgot-password", error)
        return Response.json({
            success: false,
            message: "Something went wrong. Please try again later."
        }, { status: 500 })
    }
}