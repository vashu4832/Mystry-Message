import { z } from 'zod'

export const resetPasswordSchema = z.object({
    code: z.string().length(6, { message: 'Code must be 6 digits.' }),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' })
})