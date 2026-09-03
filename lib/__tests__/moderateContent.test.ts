import { describe, it, expect, vi, beforeEach } from 'vitest'
import { moderateContent } from '@/lib/moderateContent'

describe('moderateContent', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('returns flagged: false for clean content', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [{ flagged: false, categories: {} }]
            })
        }) as any

        const result = await moderateContent('Hello, how are you?')
        expect(result.flagged).toBe(false)
    })

    it('returns flagged: true with category names for flagged content', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [{ flagged: true, categories: { harassment: true, violence: false } }]
            })
        }) as any

        const result = await moderateContent('some flaggable content')
        expect(result.flagged).toBe(true)
        expect(result.categories).toContain('harassment')
        expect(result.categories).not.toContain('violence')
    })

    it('fails open (flagged: false) if the API request fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            text: async () => 'Service unavailable'
        }) as any

        const result = await moderateContent('anything')
        expect(result.flagged).toBe(false)
    })
})