import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast"


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html> 
      <AuthProvider>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
