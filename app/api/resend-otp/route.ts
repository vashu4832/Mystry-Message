import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username } = await request.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if (user.isVerified) {
            return Response.json({
                success: false,
                message: "Account is already verified"
            }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        user.verifyCode = verifyCode
        user.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await user.save()

        const emailResponse = await sendVerificationEmail(user.email, user.username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "A new verification code has been sent to your email"
        }, { status: 200 })

    } catch (error) {
        console.error("Error resending OTP", error)
        return Response.json({
            success: false,
            message: "Error resending verification code"
        }, { status: 500 })
    }
}