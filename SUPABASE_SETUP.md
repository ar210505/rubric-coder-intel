# Supabase Backend Setup Guide

## ✅ Current Status

Your project is already configured with Supabase! The `.env` file contains your credentials.

**Project Details:**
- Project ID: `ulxvwwowsepgykayglvn`
- Project URL: `https://ulxvwwowsepgykayglvn.supabase.co`
- Status: Environment variables configured ✓

## 📋 Database Schema

Your database includes these tables:

1. **profiles** - User profile information
2. **rubrics** - Custom evaluation rubrics with criteria (JSONB)
3. **submissions** - Uploaded files awaiting evaluation
4. **evaluations** - Evaluation results with scores and feedback

All tables have Row Level Security (RLS) enabled for data protection.

## 🔧 Setup Checklist

### Step 1: Verify Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project: `ulxvwwowsepgykayglvn`
3. Verify you can access the dashboard

### Step 2: Apply Database Migrations
The migration file is in `supabase/migrations/`. You need to apply it to your Supabase project:

**Option A: Using Supabase CLI (Recommended)**
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ulxvwwowsepgykayglvn

# Apply migrations
supabase db push
```

**Option B: Manual SQL Execution**
1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20251013183058_b2253462-8310-4d46-8d6e-a59641a300d9.sql`
3. Paste and run the SQL

### Step 3: Set Up Storage Bucket (for file uploads)
1. Go to Dashboard → Storage
2. Create a new bucket named: `submissions`
3. Set bucket as **Public** or configure policies:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own files
CREATE POLICY "Users can read their submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Configure Edge Function (Optional)
The evaluation edge function (`supabase/functions/evaluate-submission/`) uses a local heuristic evaluator (no external API needed).

To deploy it:
```bash
# Deploy the function
supabase functions deploy evaluate-submission

# Set required environment variables
supabase secrets set SUPABASE_URL=https://ulxvwwowsepgykayglvn.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**To get your service role key:**
- Dashboard → Settings → API → `service_role` key (keep this secret!)

### Step 5: Test Authentication
```bash
# Start your dev server
npm run dev

# Navigate to: http://localhost:8080/auth
# Try signing up with an email
# Check Supabase Dashboard → Authentication → Users
```

## 🧪 Testing the Backend

### Test 1: Authentication
- Visit `/auth` page
- Sign up with a test email
- Verify user appears in Supabase Dashboard → Authentication

### Test 2: Database Connection
Open browser console on your app and run:
```javascript
// This should return your session if logged in
const { data, error } = await supabase.auth.getSession();
console.log(data, error);
```

### Test 3: Check Tables
In Supabase Dashboard → Table Editor, verify all tables exist:
- profiles
- rubrics
- submissions
- evaluations

## 🔐 Security Notes

1. **Never commit** your `.env` file to public repos
2. Add `.env` to `.gitignore` (already done)
3. The `SUPABASE_PUBLISHABLE_KEY` is safe for client-side use
4. The `service_role` key should ONLY be used server-side (edge functions)

## 🚀 Current Backend Features

✅ **Authentication**: Email/password auth with Supabase Auth
✅ **User Profiles**: Auto-created on signup
✅ **Rubrics**: CRUD operations for custom rubrics
✅ **Submissions**: File upload tracking
✅ **Evaluations**: Heuristic scoring with feedback
✅ **RLS Policies**: Data isolation per user

## 📝 Next Steps

1. Apply the database migration (Step 2)
2. Create the storage bucket (Step 3)
3. Test authentication flow
4. Deploy edge function (optional, if you want server-side evaluation)

## 🆘 Troubleshooting

**Problem**: "Invalid API key" error
- **Solution**: Check that `.env` file exists and values match your Supabase project

**Problem**: "relation does not exist" errors
- **Solution**: Run the migration SQL in Step 2

**Problem**: File upload fails
- **Solution**: Create the `submissions` storage bucket in Step 3

**Problem**: Can't log in
- **Solution**: Check Authentication → Providers in Dashboard, ensure Email is enabled

## 📚 Supabase Resources

- [Documentation](https://supabase.com/docs)
- [Dashboard](https://supabase.com/dashboard/project/ulxvwwowsepgykayglvn)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your backend is ready to use!** Just complete the setup checklist above and test the features.
