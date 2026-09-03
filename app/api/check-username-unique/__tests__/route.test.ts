import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/dbConnect', () => ({
    default: vi.fn().mockResolvedValue(undefined)
}))

const mockFindOne = vi.fn()
vi.mock('@/model/User', () => ({
    default: { findOne: (...args: unknown[]) => mockFindOne(...args) }
}))

import { GET } from '@/app/api/check-username-unique/route'

describe('GET /api/check-username-unique', () => {
    beforeEach(() => {
        mockFindOne.mockReset()
    })

    it('returns success when the username is available', async () => {
        mockFindOne.mockResolvedValue(null)

        const request = new Request('http://localhost/api/check-username-unique?username=freshuser')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
    })

    it('returns an error when the username is already taken', async () => {
        mockFindOne.mockResolvedValue({ username: 'takenuser', isVerified: true })

        const request = new Request('http://localhost/api/check-username-unique?username=takenuser')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).not.toBe(200)
        expect(data.success).toBe(false)
    })
})