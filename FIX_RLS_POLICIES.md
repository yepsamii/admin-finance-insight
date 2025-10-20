# Fix for Posts Loading Issue

## Problem

Posts are stuck in loading state when logged in, but work fine when not logged in.

## Root Cause

The Supabase Row Level Security (RLS) policies were too restrictive for authenticated users. The old policies only allowed:

- Viewing published posts
- Viewing posts you authored

This prevented authenticated users from seeing all posts in the Dashboard.

## Solution

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run This SQL

Copy and paste this entire SQL block and click "Run":

```sql
-- Drop existing restrictive SELECT policies on posts table
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;

-- Create new, improved SELECT policies
-- Policy 1: Anyone (including anonymous users) can view published posts
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (published = true);

-- Policy 2: Authenticated users can view all posts (published and drafts)
CREATE POLICY "Authenticated users can view all posts" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Step 3: Verify the Fix

1. Refresh your blog application
2. Log in to your account
3. Navigate to the Dashboard
4. Posts should now load correctly!

## How It Works Now

### When Not Logged In (Anonymous):

- ✅ Can view all published posts
- ❌ Cannot view draft posts

### When Logged In (Authenticated):

- ✅ Can view ALL posts (published + drafts)
- ✅ Can create posts
- ✅ Can edit own posts
- ✅ Can delete own posts

## Testing

After applying the fix:

1. **Test as Anonymous User**: Visit the home page without logging in - should see only published posts
2. **Test as Authenticated User**: Log in and visit the Dashboard - should see all posts
3. **Test Post Page**: Click on a post - should load correctly whether logged in or not

---

**Note**: This fix has already been applied to `SUPABASE_SETUP.md` for future reference.
