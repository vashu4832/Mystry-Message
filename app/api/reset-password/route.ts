import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, code, newPassword } = await request.json();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return Response.json({
                success: false,
                message: "Invalid or expired reset code"
            }, { status: 400 })
        }

        const isCodeValid = user.forgotPasswordCode === code
        const isCodeNotExpired = user.forgotPasswordCodeExpiry
            ? new Date(user.forgotPasswordCodeExpiry) > new Date()
            : false

        if (!isCodeValid || !isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Invalid or expired reset code"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.forgotPasswordCode = undefined
        user.forgotPasswordCodeExpiry = undefined
        await user.save()

        return Response.json({
            success: true,
            message: "Password reset successfully. You can now sign in with your new password."
        }, { status: 200 })

    } catch (error) {
        console.error("Error in reset-password", error)
        return Response.json({
            success: false,
            message: "Something went wrong. Please try again later."
        }, { status: 500 })
    }
}