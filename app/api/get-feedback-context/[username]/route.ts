import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    await dbConnect();

    const { username } = await params;

    try {
        const user = await UserModel.findOne({ username }).select('feedbackContext')

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            feedbackContext: user.feedbackContext ?? ''
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching public feedback context:', error)
        return Response.json({
            success: false,
            message: "Error fetching feedback context"
        }, { status: 500 })
    }
}