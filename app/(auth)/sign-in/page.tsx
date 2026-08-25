"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error) {
      toast.add({
        title: "Login Failed",
        description: "Incorrect Username or Password"
      })
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystry Message
            </h1>
            <p className="mb-4">SignIn to start your anonymous adventure</p>
          </div>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                {/* Email */}
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email/Username</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="email/username"
                          autoComplete="off"
                          id="email"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="password"
                          autoComplete="off"
                          type="password"
                          id="password"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <Button type="submit">
                Signin
              </Button>
            </form>
          </CardContent>
          <div className="text-center mt-4">
            <p>
              Not Registered Yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-900"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
