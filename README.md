# Cleaning Quote Dashboard

A professional cleaning service quote builder — create, manage, and share cleaning service proposals.

## Features

- **Quote History** — Search, duplicate, delete quotes
- **Quote Builder** — Add service areas (Kitchen, Bathroom, Bedroom, etc.) with preset tasks and pricing
- **Pricing Summary** — Real-time cost calculation with margin slider, overhead, and profit metrics
- **Service Proposal** — Professional branded proposal with print/PDF support
- **Dark Mode** — Toggle between light and dark themes
- **Local Storage** — All quotes saved locally in the browser
- **Import/Export** — Download quotes as JSON, load from file

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Install & Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Via GitHub (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your GitHub repo
4. Vercel auto-detects Next.js — just click "Deploy"

### Option 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

## Customization

- **Company branding**: Edit `QuotePreview.tsx` — change "SPARKLE PRO" name, colors, contact info
- **Preset tasks & pricing**: Edit `PRESET_TASKS` in `QuoteBuilder.tsx`
- **Default margin/rates**: Edit `createNewQuote()` in `src/lib/utils.ts`
- **Payment terms**: Edit default `paymentTerms` in `createNewQuote()`
- **Colors**: Edit CSS variables in `globals.css` and `tailwind.config.js`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage for data persistence
