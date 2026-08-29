'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { Loader2, Sparkles, Send } from 'lucide-react'

import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function PublicProfilePage() {
    const params = useParams<{ username: string }>()
    const username = params.username

    const [isSending, setIsSending] = useState(false)
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [suggestedRaw, setSuggestedRaw] = useState('')
    const [suggestError, setSuggestError] = useState('')
    const [feedbackContext, setFeedbackContext] = useState('')

    useEffect(() => {
    const fetchContext = async () => {
        try {
            const response = await axios.get<ApiResponse>(`/api/get-feedback-context/${username}`)
            setFeedbackContext(response.data.feedbackContext ?? '')
        } catch {
            // silently ignore — context is optional; no context just means nothing to show
        }
    }
    fetchContext()
}, [username])

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        },
    })

    // split streamed text on the "||" delimiter as it arrives, so
    // fully-received questions show up as pills while the last one
    // is still streaming in
    const suggestedMessages = suggestedRaw
        .split('||')
        .map((m) => m.trim())
        .filter(Boolean)

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true)
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username,
                content: data.content,
            })
            toast.add({
                title: 'Success',
                description: response.data.message,
            })
            form.reset({ content: '' })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                title: 'Message not sent',
                description:
                    axiosError.response?.data.message ??
                    'Something went wrong. Please try again.',
            })
        } finally {
            setIsSending(false)
        }
    }

    const handleSuggestMessages = async () => {
        setIsSuggesting(true)
        setSuggestError('')
        setSuggestedRaw('')

        try {
            const response = await fetch('/api/suggest-messages', {
                method: 'POST',
            })

            if (!response.ok || !response.body) {
                const errorBody = await response.json().catch(() => null)
                throw new Error(errorBody?.message ?? 'Failed to fetch suggestions')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                fullText += decoder.decode(value, { stream: true })
                setSuggestedRaw(fullText)
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to fetch suggestions'
            setSuggestError(message)
            toast.add({
                title: 'Error',
                description: message,
            })
        } finally {
            setIsSuggesting(false)
        }
    }

    const handleSelectSuggestion = (message: string) => {
        form.setValue('content', message, { shouldValidate: true })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-center">
                    Public Profile Link
                </h1>
                {feedbackContext && (
                    <div className="rounded-md border bg-muted/40 p-4 text-sm">
                        <span className="font-semibold">@{username} is looking for feedback on:</span>{' '}
                        {feedbackContext}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Send Anonymous Message to @{username}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <InputGroup>
                                <InputGroupTextarea
                                    {...form.register('content')}
                                    placeholder="Write your anonymous message here"
                                    rows={5}
                                    className="min-h-32 resize-none"
                                />
                            </InputGroup>
                            {form.formState.errors.content && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.content.message}
                                </p>
                            )}
                            <div className="flex justify-center">
                                <Button type="submit" disabled={isSending}>
                                    {isSending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" /> Send It
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Click on any message below to select it.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            variant="secondary"
                            onClick={handleSuggestMessages}
                            disabled={isSuggesting}
                            className="gap-2"
                        >
                            {isSuggesting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            Suggest New Messages
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {suggestError && (
                                <p className="text-sm text-red-500">{suggestError}</p>
                            )}
                            {suggestedMessages.length === 0 && !isSuggesting && !suggestError && (
                                <p className="text-sm text-muted-foreground">
                                    Click &quot;Suggest New Messages&quot; to generate some ideas.
                                </p>
                            )}
                            {suggestedMessages.map((message, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(message)}
                                    className="w-full text-left rounded-md border p-3 text-sm hover:bg-muted transition-colors"
                                >
                                    {message}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PublicProfilePage