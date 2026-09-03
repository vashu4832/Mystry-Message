'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/toast"
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema"
import { ApiResponse } from "@/types/ApiResponse"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { code: '', newPassword: '' },
    })

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/reset-password', {
                email,
                code: data.code,
                newPassword: data.newPassword,
            })
            toast.add({ title: "Success", description: response.data.message })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                title: "Reset failed",
                description: axiosError.response?.data.message ?? "Something went wrong.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Reset Password
                    </h1>
                    <p className="mb-4">
                        Enter the code sent to <span className="font-medium">{email || 'your email'}</span> and your new password
                    </p>
                </div>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="code"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="code">Reset Code</FieldLabel>
                                        <Input
                                            {...field}
                                            id="code"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="6-digit code"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="newPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="newPassword"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="new password"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                                </>
                            ) : ('Reset Password')}
                        </Button>
                    </form>
                </CardContent>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <ResetPasswordForm />
        </Suspense>
    )
}