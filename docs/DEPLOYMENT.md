# Deployment Guide

## Stack
| Service    | Platform  | Free tier |
|------------|-----------|-----------|
| Frontend   | Vercel    | ✅ Yes    |
| Backend    | Railway   | ✅ $5/mo hobby |
| Database   | Supabase  | ✅ Yes    |
| Vector DB  | ChromaDB  | ✅ Local (bundled in Railway) |
| DNS / CDN  | Cloudflare| ✅ Yes    |

---

## 1. Supabase — Database setup
1. Go to https://supabase.com → New project
2. Copy your **Project URL** and **anon key** and **service role key**
3. Open **SQL Editor** → paste and run `apps/web/lib/schema.sql`
4. Go to **Authentication → Providers** → enable Google and GitHub OAuth

---

## 2. Google OAuth
1. https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-vercel-url.vercel.app/api/auth/callback/google`
4. Copy Client ID and Client Secret

## 3. GitHub OAuth
1. https://github.com/settings/developers → New OAuth App
2. Homepage URL: `https://your-vercel-url.vercel.app`
3. Callback URL: `https://your-vercel-url.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret

---

## 4. Razorpay setup
1. https://razorpay.com → Sign up → Test mode
2. Settings → API Keys → Generate Key
3. Copy Key ID and Key Secret

## 5. Stripe setup
1. https://stripe.com → Sign up → Test mode
2. Developers → API Keys → copy Publishable + Secret key
3. Webhooks → Add endpoint:
   - URL: `https://your-vercel-url.vercel.app/api/payments/stripe/webhook`
   - Events: `checkout.session.completed`
4. Copy Webhook Secret

## 6. Groq API
1. https://console.groq.com → API Keys → Create key
2. Copy the key

---

## 7. Deploy Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd apps/web
vercel login
vercel link          # link to your Vercel project
```

Add these environment variables in Vercel dashboard (Settings → Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_URL                    = https://your-vercel-url.vercel.app
NEXTAUTH_SECRET                 = run: openssl rand -base64 32
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
GROQ_API_KEY
NEXT_PUBLIC_API_URL             = https://your-railway-url.railway.app
```

Then deploy:
```bash
vercel --prod
```

---

## 8. Deploy Backend → Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

cd apps/api
railway login
railway init          # create new project: portfolio-api
railway up
```

Add these env vars in Railway dashboard:
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GROQ_API_KEY
ADMIN_SECRET_KEY      = generate a strong random string
PORT                  = 8000   (Railway sets this automatically)
```

After first deploy, run the RAG ingest inside Railway:
```bash
railway run python -m agents.rag.ingest
```

---

## 9. GitHub Actions CI/CD

Add these secrets in your GitHub repo (Settings → Secrets → Actions):
```
VERCEL_TOKEN          # Vercel → Account Settings → Tokens
VERCEL_ORG_ID         # from .vercel/project.json after vercel link
VERCEL_PROJECT_ID     # from .vercel/project.json after vercel link
RAILWAY_TOKEN         # Railway → Account Settings → Tokens
```

Copy the workflows to your repo root:
```bash
# From portfolio root
cp -r infra/.github .github
```

Every push to `main` → CI checks → auto deploy to Vercel + Railway.

---

## 10. Custom domain (Cloudflare — free)

1. Buy a domain (Namecheap ~$10/yr) or use Vercel subdomain free
2. Add domain in Cloudflare → get nameservers
3. Point nameservers at your registrar
4. In Vercel: Settings → Domains → Add your domain
5. Cloudflare: Add CNAME record pointing to `cname.vercel-dns.com`
6. SSL is automatic via Cloudflare + Vercel

---

## Local dev

```bash
# Option A — Docker (recommended)
cd infra
docker-compose up

# Option B — manual
cd apps/web && npm install && npm run dev     # localhost:3000
cd apps/api && uvicorn main:app --reload     # localhost:8000
```
