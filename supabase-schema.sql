-- ============================================================================
-- CODINGTHUNDER SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ============================================================================
-- Execute this entire script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to provision your free Postgres database with real-time authentication & security.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PUBLIC PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, avatar)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/identicon/svg?seed=' || NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY DEFAULT 'crs_' || replace(uuid_generate_v4()::text, '-', ''),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT NOT NULL,
    level TEXT DEFAULT 'All Levels',
    price NUMERIC DEFAULT 0,
    original_price NUMERIC DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    thumbnail TEXT,
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    total_duration TEXT DEFAULT '10h 00m',
    total_lessons INT DEFAULT 0,
    enrollments_count INT DEFAULT 0,
    requirements JSONB DEFAULT '[]'::jsonb,
    what_you_will_learn JSONB DEFAULT '[]'::jsonb,
    instructor JSONB NOT NULL,
    sections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by anyone"
    ON public.courses FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage courses"
    ON public.courses FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 3. TUTORIALS & CHEAT SHEETS TABLE
CREATE TABLE IF NOT EXISTS public.tutorials (
    id TEXT PRIMARY KEY DEFAULT 'tut_' || replace(uuid_generate_v4()::text, '-', ''),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '8 min read',
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    views INT DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published tutorials are viewable by anyone"
    ON public.tutorials FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage tutorials"
    ON public.tutorials FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. EBOOKS TABLE
CREATE TABLE IF NOT EXISTS public.ebooks (
    id TEXT PRIMARY KEY DEFAULT 'ebk_' || replace(uuid_generate_v4()::text, '-', ''),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL,
    description TEXT,
    pages INT DEFAULT 200,
    price NUMERIC DEFAULT 499,
    original_price NUMERIC DEFAULT 1499,
    cover_image TEXT,
    preview_snippet TEXT,
    chapters JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    download_file_name TEXT,
    download_file_size TEXT,
    download_file_path TEXT,
    download_file_type TEXT,
    download_content TEXT,
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published ebooks are viewable by anyone"
    ON public.ebooks FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage ebooks"
    ON public.ebooks FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT 'ord_' || replace(uuid_generate_v4()::text, '-', ''),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT,
    item_type TEXT NOT NULL CHECK (item_type IN ('course', 'ebook')),
    item_id TEXT NOT NULL,
    item_title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
    payment_method TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. ENROLLMENTS TABLE (Course Progress)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id TEXT PRIMARY KEY DEFAULT 'enr_' || replace(uuid_generate_v4()::text, '-', ''),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percentage INT DEFAULT 0,
    completed_lesson_ids JSONB DEFAULT '[]'::jsonb,
    last_watched_lesson_id TEXT,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own enrollments"
    ON public.enrollments FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all enrollments"
    ON public.enrollments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 7. EBOOK LICENSES TABLE (Digital Downloads)
CREATE TABLE IF NOT EXISTS public.ebook_licenses (
    id TEXT PRIMARY KEY DEFAULT 'lic_' || replace(uuid_generate_v4()::text, '-', ''),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ebook_id TEXT REFERENCES public.ebooks(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_token TEXT UNIQUE NOT NULL,
    download_count INT DEFAULT 0,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    UNIQUE(user_id, ebook_id)
);

ALTER TABLE public.ebook_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ebook licenses"
    ON public.ebook_licenses FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ebook licenses"
    ON public.ebook_licenses FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 8. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY DEFAULT 'msg_' || replace(uuid_generate_v4()::text, '-', ''),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
