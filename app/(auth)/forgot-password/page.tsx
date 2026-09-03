'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "@/components/ui/toast"
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

function ForgotPasswordPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    })

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setIsSubmitting(true)
        try {
            await axios.post('/api/forgot-password', data)
        } catch {
            // Intentionally ignored — see note below
        } finally {
            setIsSubmitting(false)
            toast.add({
                title: "Check your email",
                description: "If an account with that email exists, a reset code is on its way."
            })
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Forgot Password
                    </h1>
                    <p className="mb-4">Enter your email to receive a reset code</p>
                </div>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="you@example.com"
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                </>
                            ) : ('Send Reset Code')}
                        </Button>
                    </form>
                </CardContent>
                <div className="text-center mt-4">
                    <p>
                        Remembered your password?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-900">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage