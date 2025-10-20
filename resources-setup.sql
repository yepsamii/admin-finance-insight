-- ============================================
-- RESOURCES FEATURE - COMPLETE DATABASE SETUP
-- ============================================
-- This script will DROP and RECREATE everything
-- Safe to run multiple times
-- ============================================

-- STEP 1: DROP EXISTING TABLES AND POLICIES (if they exist)
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published resources" ON public.resources;
DROP POLICY IF EXISTS "Authenticated users can view all resources" ON public.resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;
DROP POLICY IF EXISTS "Anyone can view resource tags" ON public.resource_tags;
DROP POLICY IF EXISTS "Authenticated users can manage resource tags" ON public.resource_tags;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;

-- Drop existing tables
DROP TABLE IF EXISTS public.resource_tags CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;

-- Drop existing function
DROP FUNCTION IF EXISTS increment_resource_downloads(UUID);

-- STEP 2: CREATE RESOURCES TABLE
-- ============================================

CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    downloads INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: CREATE INDEXES
-- ============================================

CREATE INDEX idx_resources_published ON public.resources(published);
CREATE INDEX idx_resources_category ON public.resources(category_id);
CREATE INDEX idx_resources_created_at ON public.resources(created_at);
CREATE INDEX idx_resources_uploaded_by ON public.resources(uploaded_by);

-- STEP 4: CREATE RESOURCE_TAGS JUNCTION TABLE
-- ============================================

CREATE TABLE public.resource_tags (
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (resource_id, tag_id)
);

-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;

-- STEP 6: CREATE RLS POLICIES FOR RESOURCES
-- ============================================

-- Anyone can view published resources (public access)
CREATE POLICY "Anyone can view published resources"
ON public.resources FOR SELECT
USING (published = true);

-- Authenticated users can view all resources (including drafts)
CREATE POLICY "Authenticated users can view all resources"
ON public.resources FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert resources
CREATE POLICY "Authenticated users can insert resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own resources
CREATE POLICY "Users can update own resources"
ON public.resources FOR UPDATE
TO authenticated
USING (auth.uid() = uploaded_by)
WITH CHECK (auth.uid() = uploaded_by);

-- Users can delete their own resources
CREATE POLICY "Users can delete own resources"
ON public.resources FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by);

-- STEP 7: CREATE RLS POLICIES FOR RESOURCE_TAGS
-- ============================================

-- Anyone can view resource tags
CREATE POLICY "Anyone can view resource tags"
ON public.resource_tags FOR SELECT
USING (true);

-- Authenticated users can manage resource tags
CREATE POLICY "Authenticated users can manage resource tags"
ON public.resource_tags FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 8: CREATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_resources_updated_at 
BEFORE UPDATE ON public.resources
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- STEP 9: CREATE DOWNLOAD COUNTER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.resources
    SET downloads = downloads + 1
    WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_resource_downloads(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_resource_downloads(UUID) TO anon;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if tables were created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resources') THEN
        RAISE NOTICE '✅ Resources table created successfully!';
    ELSE
        RAISE NOTICE '❌ Resources table was NOT created!';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resource_tags') THEN
        RAISE NOTICE '✅ Resource tags table created successfully!';
    ELSE
        RAISE NOTICE '❌ Resource tags table was NOT created!';
    END IF;
END $$;

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Next step: Set up Storage bucket (see RESOURCES_SETUP_GUIDE.md)
-- ============================================
