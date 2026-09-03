import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { messageRateLimit } from "@/lib/rateLimit";
import { moderateContent } from "@/lib/moderateContent";

export async function POST(request: Request) {

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await messageRateLimit.limit(ip)

    if (!success) {
        return Response.json({
            success: false,
            message: "You're sending messages too quickly. Please wait a moment and try again."
        }, {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            }
        })
    }

    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        // Is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                { status: 403 }
            )
        }

        const moderation = await moderateContent(content)
        if (moderation.flagged) {
            return Response.json(
                { success: false, message: "This message violates our content guidelines and cannot be sent." },
                { status: 422 }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "message send successfully"
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error adding messages ', error)
        return Response.json({
            success: false,
            message: "Internal server error"
        },
            { status: 500 }
        )
    }

}

