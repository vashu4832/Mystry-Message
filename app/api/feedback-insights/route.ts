import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { streamText, APICallError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

// No `export const runtime = 'edge'` — this route needs DB access.

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    try {
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if (!foundUser.messages || foundUser.messages.length < 3) {
            return NextResponse.json({
                success: false,
                message: "Need at least 3 messages to generate insights"
            }, { status: 400 })
        }

        const messageTexts = foundUser.messages
            .map((m, i) => `${i + 1}. ${m.content}`)
            .join('\n')

        const contextLine = foundUser.feedbackContext
            ? `The user is specifically looking for feedback on: "${foundUser.feedbackContext}".`
            : `No specific context was provided by the user.`

        const prompt = `You are analyzing anonymous feedback messages received by a user on an anonymous messaging platform. ${contextLine}

Here are the messages they've received:
${messageTexts}

Group these messages into 2 to 4 recurring themes. For each theme, output exactly these four fields separated by "::" in this order:
1. A short 3-6 word title for the theme
2. A one-sentence description of the theme
3. One representative message from the list, quoted verbatim (pick the single message that best represents this theme)
4. The number of messages that fit this theme

Separate each theme block with "|||". Output ONLY the raw data in this format, nothing else — no numbering, no markdown, no extra text before or after.

Example format:
Intriguing Historical Conversations::A thought-provoking question about historical dinner companions.::If you could have dinner with any historical figure, who would it be?::1|||Warm Personal Interactions::General conversational questions aimed at engaging warmly with others.::What's a hobby you've recently started?::3`

        const result = streamText({
            model: openai('gpt-4o-mini'),
            prompt,
            maxOutputTokens: 800,
        })

        return result.toTextStreamResponse();
    } catch (error) {
        if (APICallError.isInstance(error)) {
            return NextResponse.json(
                { name: error.name, message: error.message },
                { status: error.statusCode ?? 500 }
            )
        } else {
            console.error("Unexpected error generating insights", error)
            return NextResponse.json(
                { success: false, message: "An unexpected error occurred" },
                { status: 500 }
            )
        }
    }
}