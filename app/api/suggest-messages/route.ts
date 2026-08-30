import OpenAI from 'openai'
import { streamText, APICallError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { aiRateLimit } from '@/lib/rateLimit';


const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';


export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success } = await aiRateLimit.limit(ip)

    if (!success) {
        return NextResponse.json(
            { success: false, message: "Too many requests. Please wait before generating more suggestions." },
            { status: 429 }
        )
    }
    
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const result = streamText({
            model: openai('gpt-4o-mini'),
            prompt,
            maxOutputTokens: 500,
        })

        return result.toTextStreamResponse();
    } catch (error) {
        if (APICallError.isInstance(error)) {
            return NextResponse.json(
                {name: error.name, message: error.message},
                {status: error.statusCode ?? 500}
            )
        } else {
            console.error("Unexpected error occurred", error)
            return NextResponse.json(
                { success: false, message: "An unexpected error occurred" },
                { status: 500 }
            )
        }
    }
}

