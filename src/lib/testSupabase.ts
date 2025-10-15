// Quick Supabase Connection Test
// Run this in your browser console when the app is loaded

import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Test 1: Check environment variables
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log('✅ Environment Variables:');
  console.log('   URL:', url ? '✓ Loaded' : '✗ Missing');
  console.log('   Key:', key ? '✓ Loaded' : '✗ Missing');
  console.log('');

  // Test 2: Check Supabase client initialization
  console.log('✅ Supabase Client:', supabase ? '✓ Initialized' : '✗ Failed');
  console.log('');

  // Test 3: Check current session
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('✅ Auth Session:');
    if (session) {
      console.log('   Status: ✓ Logged in');
      console.log('   User:', session.user.email);
      console.log('   User ID:', session.user.id);
    } else {
      console.log('   Status: ℹ Not logged in (this is normal if you haven\'t signed in yet)');
    }
    if (error) console.error('   Error:', error.message);
    console.log('');
  } catch (err) {
    console.error('✗ Session check failed:', err);
  }

  // Test 4: Try to query a table (will fail with RLS if not logged in, which is expected)
  try {
    const { data, error } = await supabase.from('rubrics').select('count');
    console.log('✅ Database Connection:');
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   Status: ✓ Connected (table exists, RLS active - need to log in to query)');
      } else if (error.message.includes('relation')) {
        console.log('   Status: ⚠️  Table not found - run migrations!');
        console.log('   See SUPABASE_SETUP.md Step 2');
      } else {
        console.log('   Error:', error.message);
      }
    } else {
      console.log('   Status: ✓ Connected and queryable');
      console.log('   Rubrics count:', data);
    }
  } catch (err) {
    console.error('✗ Database query failed:', err);
  }

  console.log('\n📝 Next Steps:');
  console.log('1. If not logged in: Visit /auth to create an account');
  console.log('2. If tables missing: Apply migrations (see SUPABASE_SETUP.md)');
  console.log('3. Check Supabase Dashboard: https://supabase.com/dashboard/project/ulxvwwowsepgykayglvn');
}

// Auto-run test if in development
if (import.meta.env.DEV) {
  testSupabaseConnection();
}
