'use client'

import { toast } from '@/components/ui/toast'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        }
    });

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })

            toast.add({
                title: "Success",
                description: response.data.message
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast.add({
                title: "Signup failled",
                description: errorMessage,
            });
        }
    }

    return (
        <>
            <div className='flex justify-center items-center min-h-screen bg-zinc-900/95'>
                <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify your account
                        </h1>
                        <p className="mb-4">Enter the verification code sent to your email</p>
                    </div>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FieldGroup>
                                {/* Code */}
                                <Controller
                                name="code"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                                        <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="code"
                                        id="code"
                                        autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                    );
                                }}
                                />
                            </FieldGroup>
                            <Button type='submit'>Submit</Button>
                        </form>
                    </CardContent>
                </div>
            </div>
        </>
    )
}

export default VerifyAccount
