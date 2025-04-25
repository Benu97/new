# Supabase Setup Instructions

1. Create a file named `.env.local` in the root of your project.
2. Add the following content to the file:

```
NEXT_PUBLIC_SUPABASE_URL=https://gugmyndgllbbymrypjpw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Z215bmRnbGxiYnltcnlwanB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzk3NzAsImV4cCI6MjA1OTg1NTc3MH0.T9JVd_mEKi3zyCmc-2Zxl7hBN4jp74vwJj_o-JP8kLg
```

3. Restart your development server if it's running:
```bash
npm run dev
```

4. These credentials are also needed for GitHub Actions. Make sure to add them as repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_DB_URL` (with format `postgresql://postgres:[PASSWORD]@db.gugmyndgllbbymrypjpw.supabase.co:5432/postgres`) 