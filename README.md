# Codingthunder ⚡
> Production-Ready Coding Education & LMS Platform inspired by CodeWithHarry. Built with React 19, TypeScript, Tailwind CSS, Express full-stack architecture, Supabase authentication & database backend, course progress tracking, interactive terminals, markdown cheat sheets, and secure digital ebook delivery.

---

## 1. Production Architecture Overview

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide icons, Framer Motion
- **Database & Auth (Cloud):** Supabase (PostgreSQL with Row Level Security & Auth triggers)
- **Database & Auth (Local / Self-Hosted Fallback):** Integrated Express backend with PBKDF2 password hashing & HMAC-SHA256 bearer tokens
- **Hosting Targets:** 100% Free on **Vercel** or **Netlify**
- **Production User Role Allocation:** The very first user to register on a clean database automatically becomes the **Administrator**. All subsequent registrations are enrolled as **Students**.

---

## 2. Deploying for Free on Supabase (Database & Auth)

Supabase offers a generous **Free Tier** that includes 500MB PostgreSQL database, 50,000 monthly active users (MAU), social authentication, and unlimited API requests.

### Step 1: Create a Free Project
1. Go to [supabase.com](https://supabase.com) and sign in with GitHub.
2. Click **"New Project"**, select an organization, name your project (e.g. `codingthunder`), and set a strong database password.
3. Choose the region closest to your audience (e.g., `Singapore` or `Mumbai` for Asia, `Frankfurt` for Europe, `US East` for America).

### Step 2: Run the Database Schema
1. In the Supabase Dashboard, click on **"SQL Editor"** (terminal icon in the left sidebar).
2. Open `/supabase-schema.sql` from this repository, copy its entire contents, and paste it into the SQL Editor.
3. Click **"Run"**.
   - This automatically provisions the `profiles`, `courses`, `tutorials`, `ebooks`, `orders`, `enrollments`, `ebook_licenses`, and `contact_messages` tables.
   - It also enables **Row Level Security (RLS)** and installs the `handle_new_user()` trigger so that whenever a student signs up via Supabase Auth, their profile is synchronized automatically.

### Step 3: Copy Your API Keys
1. In Supabase Dashboard, navigate to **Project Settings -> API** (or **Settings -> Configuration -> API**).
2. Copy the following two values:
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Project API Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI...`

---

## 3. Deploying for Free on Vercel

Vercel provides a 100% free Hobby tier with global edge CDN, automatic HTTPS, and instant Git deployments.

### Step 1: Push Code to GitHub / GitLab
```bash
git init
git add .
git commit -m "feat: production codingthunder release"
git remote add origin https://github.com/your-username/codingthunder.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Log into [vercel.com](https://vercel.com) and click **"Add New..." -> "Project"**.
2. Select your `codingthunder` repository.
3. Vercel will automatically detect `vite` from `vercel.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key-here`
5. Click **"Deploy"**.
6. Within 60 seconds, your site is live with a free `https://codingthunder.vercel.app` URL and free SSL!

---

## 4. Deploying for Free on Netlify

Netlify also provides a generous free tier with 100GB monthly bandwidth, continuous deployment, and free HTTPS.

### Step 1: Deploy on Netlify
1. Log into [netlify.com](https://netlify.com) and click **"Add new site" -> "Import an existing project"**.
2. Connect your GitHub/GitLab account and choose the repository.
3. Netlify will automatically detect configuration from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Under **Site configuration -> Environment variables**, add:
   - `VITE_SUPABASE_URL`: `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key-here`
5. Click **"Deploy site"**.
6. Your application will be live on `https://your-site-name.netlify.app`.

---

## 5. First-Time Setup & Administrator Access

1. Open your live deployed site.
2. Click **"Sign In" -> "Create one"** (or click **"Sign Up"**).
3. Fill in your name, email, and password to register.
4. Because this is the first account registered in your database, the system will **automatically grant your account the Administrator role**.
5. Once signed in, you will see the **"Admin Dashboard"** button in the navigation header, giving you access to:
   - Course CRUD and lesson builder
   - Markdown tutorial publisher
   - Ebook store & file upload manager
   - Student enrollment controls
   - User permissions management

---

## 6. Payment Gateway Integration (Ready When You Are)

Payment processing is fully structured in the codebase and can be turned on whenever you wish to accept live payments:

1. **Razorpay (India & UPI / NetBanking / Cards):**
   - Provide `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in environment variables or Admin Dashboard Settings.
2. **Stripe (Global Credit / Debit Cards):**
   - Provide `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.
3. **Test Sandbox Mode:**
   - Pre-configured to test purchases and instant digital fulfillment without entering real credit cards.
