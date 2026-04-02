# TP ETS Recruitment Platform

Full-stack recruitment platform for TP Malaysia & Thailand with AI-powered screening, multi-channel notifications (WhatsApp + LINE), and role-based access control.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma ORM → Supabase PostgreSQL
- **AI**: Anthropic Claude API (screening, offer analysis)
- **Notifications**: WhatsApp Cloud API (MY) + LINE Messaging API (TH)
- **Auth**: OTP-based (candidates + staff)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.template .env
```

Required: `DATABASE_URL`, `DIRECT_URL` (Supabase), `ANTHROPIC_API_KEY`

Optional: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `LINE_CHANNEL_TOKEN`, `LINE_CHANNEL_SECRET`

### 3. Initialize database

```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

### 5. Deploy

```bash
npx vercel --prod
```

## Notification Routing

| Country | Primary | Fallback |
|---------|---------|----------|
| MY | WhatsApp | LINE → Email |
| TH | LINE | WhatsApp → Email |
