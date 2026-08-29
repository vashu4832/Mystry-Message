import { z } from 'zod'

export const feedbackContextSchema = z.object({
    context: z
        .string()
        .max(500, { message: 'Context must be under 500 characters.' }),
})