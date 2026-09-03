type ModerationResult = {
    flagged: boolean;
    categories: string[];
}

export async function moderateContent(content: string): Promise<ModerationResult> {
    try {
        const response = await fetch('https://api.openai.com/v1/moderations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'omni-moderation-latest',
                input: content,
            }),
        })

        if (!response.ok) {
            console.error('Moderation API request failed', await response.text())
            // Fail open: if the moderation service itself is down, don't
            // block a legitimate user's message over an infrastructure issue.
            return { flagged: false, categories: [] }
        }

        const data = await response.json()
        const result = data.results?.[0]

        if (!result) {
            return { flagged: false, categories: [] }
        }

        const flaggedCategories = Object.entries(result.categories ?? {})
            .filter(([, isFlagged]) => isFlagged)
            .map(([category]) => category)

        return {
            flagged: result.flagged ?? false,
            categories: flaggedCategories,
        }
    } catch (error) {
        console.error('Error calling moderation API', error)
        return { flagged: false, categories: [] }
    }
}