import { describe, it, expect } from 'vitest'
import { messageSchema } from '@/schemas/messageSchema'

describe('messageSchema', () => {
    it('accepts a valid message', () => {
        const result = messageSchema.safeParse({
            content: 'This is a perfectly valid message with enough length.'
        })
        expect(result.success).toBe(true)
    })

    it('rejects a message that is too short', () => {
        const result = messageSchema.safeParse({ content: 'short' })
        expect(result.success).toBe(false)
    })

    it('rejects a message that is too long', () => {
        const result = messageSchema.safeParse({ content: 'a'.repeat(301) })
        expect(result.success).toBe(false)
    })
})