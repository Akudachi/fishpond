# Freshers Fish Pond — Interactive College Freshers Game

An interactive, animated digital fish pond website created for college Freshers Day events. Students submit dares and challenges through a public link, administrators moderate and approve submissions, and on stage freshers catch a fish to reveal their challenge on the big auditorium screen!

---

## Features

- **Interactive Underwater Fish Pond Simulation:**
  - 60 FPS Canvas simulation with realistic swimming fish, sinusoidal tail wagging, floating bubbles, light caustics, and water ripples.
  - 2-second animated fish catching sequence: fishing hook descends, splash particles emit, and fish is caught.
  - Celebratory victory fanfare & confetti bursts.
  - High-contrast auditorium projector card typography readable from anywhere in the hall.
  - Dedicated **Projector Mode** (true Fullscreen API).
  - Built-in Web Audio API sound synthesizer with mute toggle (100% offline, no external audio file dependencies).
- **Public Student Challenge Submission (`/submit`):**
  - Instant submission without registration.
  - **Your Name is mandatory** (`Required`).
  - 250-character limit with live character counter and validation.
  - Submissions are set to `status = 'pending'` and stay strictly hidden from public view until admin approval.
- **Truly Random Fish Catch Selection (`/pond`):**
  - Fair, uniform cryptographic randomness (`crypto.getRandomValues`).
  - Avoids consecutive duplicate dares when more than 1 approved challenge is available.
- **Secure Administrator Console (`/admin/dashboard`):**
  - Protected with Supabase Authentication and database-level `admin_users` verification.
  - Queues for `All`, `Pending Review`, `Approved Dares`, and `Rejected Dares`.
  - Approve, Reject, Edit dare text, Delete, and Restore actions.
  - Search by challenge text or student name.
  - Event title, college name, and game flags configuration.
- **Offline / Local Demo Fallback:**
  - If Supabase environment variables are not yet configured, the app operates seamlessly in local interactive demo mode with pre-seeded dares!

---

## Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`.

---

## Supabase Database Setup

1. Open your **Supabase Dashboard** -> **SQL Editor** -> **New query**.
2. Run the SQL script located at [`supabase/migrations/001_initial_schema.sql`](file:///supabase/migrations/001_initial_schema.sql).
3. Run the security policies located at [`supabase/migrations/002_security_policies.sql`](file:///supabase/migrations/002_security_policies.sql).
4. Run [`supabase/seed.sql`](file:///supabase/seed.sql) to add sample approved challenges.

### Provisioning an Administrator

1. In Supabase Dashboard, go to **Authentication -> Users** and click **"Add user" -> "Create user"** with your desired email and password.
2. Copy the generated **User UID**.
3. In the SQL Editor, grant admin privileges:
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('<PASTE-USER-UID-HERE>', 'admin@college.edu', 'admin');
   ```

---

## Vercel Deployment

1. Initialize git and commit your project:
   ```bash
   git add .
   git commit -m "Freshers Fish Pond initial release"
   ```
2. Push your repository to GitHub.
3. Import the repository in [Vercel](https://vercel.com).
4. In the Vercel project settings, configure the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. The included `vercel.json` ensures SPA routes (`/submit`, `/pond`, `/admin/login`, `/admin/dashboard`) route seamlessly without 404s.

---

## Testing Verification

- **Submit Dare:** Visit `/submit`, fill in your name and dare text, and verify the confirmation message.
- **Admin Approval:** Log in at `/admin/login`, open the **Pending Review** queue, and click **Approve**.
- **Fish Catch:** Open `/pond`, click **CATCH A FISH 🎣**, wait for the 2-second hook and reel animation, and view the revealed challenge!
