# Supabase Database Setup Instructions

## 1. Database Schema Creation

Run these SQL commands in your Supabase SQL Editor to create the required tables:

### Categories Table

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_categories_slug ON categories(slug);
```

### Posts Table

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,
  header_image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);
```

### Tags Table

```sql
-- Create tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_tags_slug ON tags(slug);
```

### Post Tags Junction Table

```sql
-- Create post_tags junction table for many-to-many relationship
CREATE TABLE post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

## 2. Row Level Security (RLS) Policies

Enable RLS and create policies for secure access:

### Enable RLS

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
```

### Categories Policies

```sql
-- Categories: Anyone can read, only authenticated users can write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Posts Policies

```sql
-- Posts: Published posts are viewable by everyone, all posts by author
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);
```

### Tags Policies

```sql
-- Tags: Anyone can read, only authenticated users can write
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Tags are insertable by authenticated users" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Tags are updatable by authenticated users" ON tags
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Tags are deletable by authenticated users" ON tags
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Post Tags Policies

```sql
-- Post Tags: Anyone can read, only authenticated users can write
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Post tags are insertable by authenticated users" ON post_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Post tags are updatable by authenticated users" ON post_tags
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Post tags are deletable by authenticated users" ON post_tags
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 3. Functions and Triggers

### Update Timestamps Function

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Apply Triggers

```sql
-- Apply update triggers to tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Slug Generation Function

```sql
-- Function to generate URL-friendly slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;
```

## 4. Sample Data

### Insert Sample Categories

```sql
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Posts about technology and programming'),
('Lifestyle', 'lifestyle', 'Personal lifestyle and experiences'),
('Tutorials', 'tutorials', 'Step-by-step tutorials and guides');
```

### Insert Sample Tags

```sql
INSERT INTO tags (name, slug) VALUES
('react', 'react'),
('javascript', 'javascript'),
('tutorial', 'tutorial'),
('web-development', 'web-development'),
('personal', 'personal'),
('tips', 'tips');
```

## 5. Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. Verification

After running all the above SQL commands, verify your setup by:

1. Check that all tables are created in the Table Editor
2. Verify RLS policies are enabled
3. Test inserting a sample post (you'll need to be authenticated)
4. Check that the functions and triggers are working

## 7. Next Steps

Once the database is set up:

1. Update your Supabase client configuration
2. Create API service functions for CRUD operations
3. Implement the blog components in your React app
4. Test the complete flow from creation to display

## Notes

- All timestamps are in UTC
- Slugs are automatically generated and must be unique
- Posts can be published or kept as drafts
- The system supports multiple tags per post
- Categories are global and can be reused across posts
- RLS ensures users can only modify their own posts
