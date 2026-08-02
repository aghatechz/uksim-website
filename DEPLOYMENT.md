# 🚀 Vercel Deployment Guide — Vodafone SIM Hub

> Complete step-by-step guide to deploy this Next.js app on **Vercel** (free plan).
> Written specifically for this project (Next.js 16, Prisma/PostgreSQL, file-based stores).

---

## ✅ STATUS: Code is now Vercel-ready!

The code has already been fixed for Vercel deployment:

| Fix | What changed |
|---|---|
| ✅ Products → Database | `lib/productsStore.ts` now syncs products to PostgreSQL (`getStoredProductsAsync`) — admin product add/edit/delete works on Vercel |
| ✅ Admin credentials → env vars | `app/api/admin/auth/route.ts` reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env vars first (file fallback for local dev) |
| ✅ OTP/password reset | In-memory cache keeps OTP flow working on serverless (where file writes are blocked) |
| ✅ Prisma build | `postinstall: prisma generate` + `serverExternalPackages` in `next.config.ts` |

**What you still need:** a **cloud PostgreSQL database** (Neon/Supabase) so Vercel can reach your data. Your local `localhost` DB won't work from Vercel — follow Step 1 below.

---

## 🧰 Prerequisites

Create these accounts (all free):

| Service | Why | Link |
|---|---|---|
| **GitHub** | Store code + auto-deploy | https://github.com |
| **Vercel** | Host the app | https://vercel.com |
| **Neon** (or Supabase) | Free PostgreSQL database | https://neon.tech |
| **Resend** | Transactional email (free tier 100/day) | https://resend.com |

---

## 🗄️ STEP 1 — Create the PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) → Sign up → Create project
2. Region: choose closest (e.g. Singapore or Mumbai for Pakistan users)
3. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. This is your `DATABASE_URL`

> 🔁 Alternative: **Supabase** → New project → Connect → "Connection string (URI)".
> Or **Vercel Marketplace**: In Vercel dashboard → Storage → Create Database (Neon). Easiest — Vercel sets `DATABASE_URL` automatically!

---

## 🔑 STEP 2 — Environment Variables (locally)

Create a file `.env.local` in the project root (it's gitignored):

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Email — Resend (recommended)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="Vodafone SIM Hub <orders@resend.dev>"

# Email — Gmail SMTP fallback
GMAIL_USER="agha.irtiza.rizvi@gmail.com"
GMAIL_PASS="your-gmail-app-password"

# Admin
ADMIN_EMAIL="agha.irtiza.rizvi@gmail.com"
ADMIN_PASSWORD="VodafoneAdmin#2026"   # ⚠️ change this! (currently hardcoded in data/admin-credentials.json)
```

**⚠️ Security note:** Your admin credentials and a Gmail app password are currently hardcoded inside `app/api/admin/auth/route.ts`. Before going live, move these to env vars (I can do this for you).

---

## 📦 STEP 3 — Set Up the Database Schema

Run these commands in the project folder:

```bash
# 1. Install dependencies
npm install

# 2. Generate the Prisma client
npx prisma generate

# 3. Create tables in the new Postgres database
npx prisma migrate dev --name init

# 4. Seed initial products & orders
npx prisma db seed
```

> ⚠️ `prisma migrate dev` uses the `DATABASE_URL` from `.env.local`. Make sure it points to the **Neon/Supabase** database, not your local one.

---

## 📤 STEP 4 — Push Code to GitHub

```bash
# 1. Initialize git (project is not a git repo yet!)
git init
git add .
git commit -m "Initial commit — Vodafone SIM Hub"

# 2. Create a repo on GitHub (github.com → New repository → don't tick "add README")
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vodafone-sim-hub.git
git push -u origin main
```

> 🔐 If you get an auth error on push, use a **Personal Access Token** (GitHub → Settings → Developer settings → Tokens) instead of your password.

---

## ⚡ STEP 5 — Deploy on Vercel

### Option A — Dashboard (easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → Connect GitHub → select `vodafone-sim-hub`
3. Vercel auto-detects Next.js. Keep defaults:

   | Setting | Value |
   |---|---|
   | Framework | **Next.js** (auto) |
   | Build Command | `prisma generate && next build` ⚠️ (see note below) |
   | Install Command | `npm install` (auto) |
   | Output Directory | leave empty |

4. Click **Environment Variables** → add:
   - `DATABASE_URL` → your Neon connection string
   - `RESEND_API_KEY` → from Resend
   - `GMAIL_USER`, `GMAIL_PASS` → if using SMTP fallback
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
5. Click **Deploy** 🚀

### Option B — Vercel CLI (from your PC)

```bash
npm i -g vercel
vercel login
vercel            # first time: link project, it uploads directly
vercel --prod     # deploy to production
```

### ⚠️ IMPORTANT — Build command for Prisma

On Vercel, Prisma needs to generate the client during the build. Either:

- Add a **postinstall** script in `package.json`:
  ```json
  "postinstall": "prisma generate"
  ```
  …or set the build command in Vercel to: `prisma generate && next build`

Also add this to `next.config.ts` (Prisma + serverless):
```ts
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
};
```
*(This tells Next.js not to bundle Prisma into a single file — required for Prisma 5+ on serverless.)*

---

## 🌐 STEP 6 — Custom Domain (vodafonesimhub.pk)

1. In Vercel → your project → **Settings → Domains**
2. Add your domain: `vodafonesimhub.pk`
3. Vercel shows DNS records to add at your domain registrar:
   - **A record** → `76.76.21.21` (or the IP Vercel gives you)
   - **CNAME** → `cname.vercel-dns.com` (for www)
4. Add them at your registrar (Namecheap, GoDaddy, Hostinger, or wherever your domain is)
5. Wait for DNS to propagate (5 min – 48 hrs). Vercel auto-issues a free **SSL certificate** ✓

> ℹ️ If `vodafonesimhub.pk` is not your domain, skip this step — Vercel gives you `your-app.vercel.app` for free.

---

## ✅ STEP 7 — Post-Deploy Checklist

Test everything after deploy:

- [ ] Homepage loads (`https://your-app.vercel.app/`)
- [ ] Products page shows all 5 SIM products
- [ ] **Place a test order** → order saves to database
- [ ] **Admin panel** (`/admin/orders`) → login works, order appears
- [ ] Change order status → refresh → still there (persisted!)
- [ ] Add a new product in admin → appears on site
- [ ] Test order email notification arrives (Resend/SMTP)
- [ ] Track order page works (`/track`)
- [ ] Checkout flow works end-to-end
- [ ] Mobile view looks good (Vercel serves globally, fast in Pakistan)

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `PrismaClientInitializationError: P1001` | `DATABASE_URL` is wrong/not set. Check Vercel → Settings → Environment Variables |
| `ENOENT: no such file` on `data/*.json` | Expected on Vercel — read-only filesystem. Data must come from Postgres (Step 0) |
| Build fails with Prisma error | Add `prisma generate` to build command or `postinstall` |
| `Cannot find module '@prisma/client'` at runtime | Add `serverExternalPackages: ["@prisma/client"]` to `next.config.ts` |
| Email not sending | Resend free tier: only works with your own verified domain, not `resend.dev`. Or use Gmail SMTP |
| Slow first load | Normal for serverless cold starts — subsequent loads are fast (CDN) |

---

## 📊 Free Plan Limits (Vercel Hobby)

| Resource | Limit |
|---|---|
| Bandwidth | 100 GB/month |
| Serverless functions | 100k/month |
| Builds | 100/month |
| Custom domains | Supported |
| Edge network | 30 regions (fast globally) |

*This store will easily stay within free limits for thousands of orders/month.*

---

## 🔁 Redeploy after changes

**Automatic:** push to GitHub → Vercel auto-deploys.

**Manual:**
```bash
git add .
git commit -m "description"
git push origin main
```

---

*Questions? Ask Buffy — the code changes needed for Step 0 (products → DB, admin creds → env) can be done in a few minutes.*
