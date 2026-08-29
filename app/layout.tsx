'use client'

import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast"
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html> 
      <AuthProvider>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
        {children}
        <Toaster />
        </SessionProvider>
      </body>
      </AuthProvider>
    </html>
  );
}
