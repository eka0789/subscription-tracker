# SubTracker — Tools Subscription & Renewal Tracker

SubTracker is a web dashboard for IT/admin teams to track software/tool subscriptions and renewal schedules. Built as a practical technical assessment deliverable.

## Technologies Used

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (PostgreSQL database)
- **Tailwind CSS** (v4)
- **shadcn/ui**
- **lucide-react**
- **Vercel** (deployment)

## Features Implemented

### Required
- ✅ Add / Edit / Delete subscriptions
- ✅ Update subscription status
- ✅ View subscription list with all required fields
- ✅ Dashboard with Total / Active / Expiring Soon / Expired counts

### Bonus
- ✅ Search by tool name and department (debounced 300ms)
- ✅ Filter by status
- ✅ Sort by column (name, department, date, cost, status) — toggle asc/desc
- ✅ Status color badges (Active / Expiring Soon / Expired / Cancelled)
- ✅ Renewal alerts ⚠️ for subscriptions ≤ 7 days
- ✅ Export to CSV
- ✅ Responsive on mobile (375px) and desktop (1280px)

## Setup Instructions

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and fill in your Supabase credentials
   ```

4. **Set up Supabase database**

   Run the SQL below in your Supabase SQL Editor:

   ```sql
   CREATE TYPE subscription_status AS ENUM (
     'active', 'expiring_soon', 'expired', 'cancelled'
   );

   CREATE TABLE subscriptions (
     id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     tool_name     TEXT NOT NULL,
     department    TEXT NOT NULL,
     renewal_date  DATE NOT NULL,
     monthly_cost  NUMERIC(12, 2) NOT NULL DEFAULT 0,
     status        subscription_status NOT NULL DEFAULT 'active',
     notes         TEXT,
     created_at    TIMESTAMPTZ DEFAULT NOW(),
     updated_at    TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE OR REPLACE FUNCTION update_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER set_updated_at
     BEFORE UPDATE ON subscriptions
     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

   ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow all operations for anon"
     ON subscriptions FOR ALL TO anon
     USING (true) WITH CHECK (true);
   ```

   Then seed 15 sample rows:

   ```sql
   INSERT INTO subscriptions (tool_name, department, renewal_date, monthly_cost, status, notes) VALUES
     ('Slack',            'Engineering',    CURRENT_DATE + 90,  12.50,  'active',        'Team communication tool'),
     ('Notion',           'Product',        CURRENT_DATE + 120, 8.00,   'active',        'Documentation & wiki'),
     ('GitHub Teams',     'Engineering',    CURRENT_DATE + 15,  4.00,   'expiring_soon', 'Version control - renew ASAP'),
     ('Figma',            'Design',         CURRENT_DATE + 7,   15.00,  'expiring_soon', 'UI/UX design tool'),
     ('Zoom',             'Operations',     CURRENT_DATE - 10,  14.99,  'expired',       'Video conferencing'),
     ('Adobe CC',         'Design',         CURRENT_DATE - 30,  54.99,  'expired',       'Creative suite license'),
     ('Jira',             'Engineering',    CURRENT_DATE + 180, 7.75,   'active',        'Issue tracking'),
     ('Confluence',       'Engineering',    CURRENT_DATE + 180, 5.50,   'active',        'Team wiki'),
     ('AWS',              'Infrastructure', CURRENT_DATE + 60,  350.00, 'active',        'Cloud infrastructure'),
     ('Google Workspace', 'All Dept',       CURRENT_DATE + 22,  12.00,  'expiring_soon', '50 user licenses'),
     ('Canva',            'Marketing',      CURRENT_DATE - 5,   12.99,  'expired',       'Graphic design'),
     ('Grammarly',        'Marketing',      CURRENT_DATE - 60,  12.00,  'cancelled',     'Cancelled - low usage'),
     ('1Password',        'Operations',     CURRENT_DATE - 45,  7.99,   'cancelled',     'Replaced by Bitwarden'),
     ('Cloudflare',       'Infrastructure', CURRENT_DATE + 200, 20.00,  'active',        'CDN & DNS management'),
     ('Sentry',           'Engineering',    CURRENT_DATE + 45,  26.00,  'active',        'Error monitoring');
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

## Live Demo

[your-app.vercel.app](https://your-app.vercel.app)
