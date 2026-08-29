'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { User } from 'next-auth'
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    const displayName = user?.username || user?.email
    const initial = displayName?.charAt(0).toUpperCase()

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 p-4 md:p-6">
                <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Mystry Message
                </Link>

                {session ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                                {initial}
                            </div>
                            <span className="text-sm text-zinc-300">
                                Welcome, <span className="text-white font-medium">{displayName}</span>
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full md:w-auto gap-2 border-zinc-700 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto bg-white text-zinc-900 hover:bg-zinc-200">
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar