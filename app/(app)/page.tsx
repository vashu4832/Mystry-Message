// 'use client'

// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"
// import Autoplay from 'embla-carousel-autoplay'
// import messages from '@/data/messages.json'

// function Page() {

//   return (
//     <>
//       <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
//         <section className="text-center mb-8 md:mb-12">
//           <h1 className="text-3xl md:text-5xl font-bold">
//             Dive into the World of Anonymous Conversations
//           </h1>
//           <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystery Message - Where your identity remains a secret.</p>
//         </section>

//         <Carousel plugins={[Autoplay({delay: 2000})]} className="w-full max-w-[12rem] sm:max-w-xs">
//           <CarouselContent>
//             {
//               messages.map((message, index) => (
//                 <CarouselItem key={index}>
//                 <div className="p-1">

//                   <Card>
//                     <CardHeader>
//                       {message.title}
//                     </CardHeader>
//                     <CardContent className="flex aspect-square items-center justify-center p-6">
//                       <span className="text-xl font-semibold">{message.content}</span>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CarouselItem>
//               ))
//             }
//           </CarouselContent>
//           <CarouselPrevious />
//           <CarouselNext />
//         </Carousel>
//       </main>
//       <footer className="text-center p-4 md:p-6">
//         @2026 Mystry Message. All right reserved.
//       </footer>
//     </>
//   )
// }

// export default Page



'use client'

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/data/messages.json'
import {
  Sparkles,
  ArrowRight,
  MessageSquareText,
  Quote,
  UserPlus,
  Link2,
} from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in seconds and claim your unique username.",
  },
  {
    icon: Link2,
    title: "Share Your Link",
    description: "Drop your personal link in your bio, stories, or chats.",
  },
  {
    icon: MessageSquareText,
    title: "Receive Honest Messages",
    description: "Get anonymous messages from anyone — their identity stays hidden.",
  },
] as const

function Page() {
  const router = useRouter()

  return (
    <>
      <main className="grow flex flex-col items-center px-4 md:px-24 py-12 gap-16 md:gap-24">

        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto pt-6 md:pt-10">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs md:text-sm text-muted-foreground mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            100% Anonymous
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Dive into the World of{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Anonymous Conversations
            </span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Explore Mystry Message — where your identity remains a secret, and honesty finally has a safe place to live.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" onClick={() => router.push("/sign-up")}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          </div>
        </section>

        {/* Carousel — same data source, same Autoplay plugin, same components */}
        <section className="w-full flex flex-col items-center">
          <div className="text-center mb-8 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold">What People Are Sharing</h2>
            <p className="mt-2 text-muted-foreground">
              A glimpse into the honest, anonymous messages flowing through Mystry Message.
            </p>
          </div>

          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted/40">
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <MessageSquareText className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex aspect-square flex-col items-center justify-center gap-4 p-6 text-center">
                        <Quote className="h-6 w-6 text-primary/30" />
                        <span className="text-lg font-semibold leading-snug">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* How It Works — new section */}
        <section className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to start receiving anonymous messages</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.title} className="text-center border-none shadow-sm bg-muted/30">
                  <CardHeader className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Closing CTA — new section */}
        <section className="w-full max-w-2xl text-center rounded-2xl border bg-muted/30 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to Hear the Truth?</h2>
          <p className="mt-3 text-muted-foreground">
            Join the people already discovering what others really think — anonymously, honestly, and without judgment.
          </p>
          <Button size="lg" className="mt-6 gap-2" onClick={() => router.push("/sign-up")}>
            Create Your Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

      </main>

      <footer className="border-t bg-muted/30 py-6 md:py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Mystry Message. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Page