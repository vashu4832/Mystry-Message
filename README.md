# 🕵️ Mystry Message

**Mystry Message** is a full-stack anonymous messaging platform where anyone can send you honest, anonymous feedback through a personal link, no sign-up required from the sender. Powered by AI, it also suggests engaging conversation starters and surfaces themed insights from the messages you receive.

> 🔗 **Live App:** [https://mystry.ashulabs.dev](https://mystry.ashulabs.dev) &nbsp;

---

## ✨ Features

- **🔒 Secure Authentication**: Email/password sign-up with 6-digit email verification, powered by NextAuth.js and Resend
- **🔗 Personal Public Link**: Share a unique `/u/username` link to receive anonymous messages from anyone, no account needed on their end
- **🎛️ Message Control**: Toggle whether you're currently accepting messages, and delete any message you've received
- **🤖 AI Message Suggestions**: Streamed, AI-generated conversation starters that senders can tap to auto-fill their message
- **🎯 AI Feedback Context**: Tell the AI what kind of feedback you're looking for, shown to senders before they write
- **💡 AI Feedback Insights**: AI groups your received messages into recurring themes with representative quotes, so you can see patterns at a glance
- **📱 Fully Responsive**: Clean, accessible UI built with shadcn/ui and Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB with Mongoose |
| Authentication | NextAuth.js (Credentials Provider, JWT sessions) |
| Styling | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) |
| Forms & Validation | React Hook Form + Zod |
| Email | [Resend](https://resend.com/) |
| AI | OpenAI (via [Vercel AI SDK](https://sdk.vercel.ai/)) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- A [Resend](https://resend.com/) account and API key
- An [OpenAI](https://platform.openai.com/) API key

### 1. Clone the repository

```bash
git clone https://github.com/vashu4832/Mystry-Message.git
cd Mystry-Message
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root and add the following:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Resend (email verification)
RESEND_API_KEY=your_resend_api_key

# OpenAI (AI suggestions & insights)
OPENAI_API_KEY=your_openai_api_key
```

> 💡 Generate a `NEXTAUTH_SECRET` quickly with:
> ```bash
> openssl rand -base64 32
> ```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

### 5. Build for production (optional local check)

```bash
npm run build
npm start
```

---

## 📁 Project Structure (high level)

```
app/
├── (app)/              # Authenticated routes (dashboard) + shared layout
├── (auth)/             # Sign-up, sign-in, verify pages
├── u/[username]/        # Public anonymous message page
└── api/                 # Route handlers (auth, messages, AI, etc.)
components/               # Reusable UI components (shadcn/ui-based)
model/                    # Mongoose schemas
schemas/                  # Zod validation schemas
lib/                      # Database connection utility
```

---

## 📄 License

This project is open source and available for personal and educational use.

---

Built with ☕ and a lot of debugging by [Ashutosh](https://github.com/vashu4832).
