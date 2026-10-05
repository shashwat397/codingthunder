-- ============================================================================
-- CODINGTHUNDER PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase Compatible)
-- ============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    avatar VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    level VARCHAR(32) DEFAULT 'All Levels',
    price INTEGER DEFAULT 0,
    original_price INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    thumbnail VARCHAR(512),
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    total_duration VARCHAR(32) DEFAULT '10h 00m',
    total_lessons INTEGER DEFAULT 0,
    enrollments_count INTEGER DEFAULT 0,
    requirements JSONB DEFAULT '[]'::jsonb,
    what_you_will_learn JSONB DEFAULT '[]'::jsonb,
    instructor JSONB NOT NULL,
    sections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- 3. Tutorials & Cheat Sheets Table
CREATE TABLE IF NOT EXISTS tutorials (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    read_time VARCHAR(32) DEFAULT '10 min read',
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorials_slug ON tutorials(slug);

-- 4. Ebooks & Digital Products Table
CREATE TABLE IF NOT EXISTS ebooks (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    pages INTEGER DEFAULT 200,
    price INTEGER DEFAULT 499,
    original_price INTEGER DEFAULT 1499,
    cover_image VARCHAR(512),
    preview_snippet TEXT,
    chapters JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    download_file_name VARCHAR(255),
    download_file_size VARCHAR(64),
    download_file_path VARCHAR(512),
    download_file_type VARCHAR(64),
    download_content TEXT,
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ebooks_slug ON ebooks(slug);

-- 5. Orders & Transactions Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    item_type VARCHAR(32) NOT NULL CHECK (item_type IN ('course', 'ebook')),
    item_id VARCHAR(64) NOT NULL,
    item_title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR',
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
    payment_method VARCHAR(32) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    receipt_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- 6. Enrollments & Course Progress Table
CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percentage INTEGER DEFAULT 0,
    completed_lesson_ids JSONB DEFAULT '[]'::jsonb,
    last_watched_lesson_id VARCHAR(64),
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);

-- 7. Ebook Licenses & DRM Tokens Table
CREATE TABLE IF NOT EXISTS ebook_licenses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    ebook_id VARCHAR(64) REFERENCES ebooks(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_token VARCHAR(255) UNIQUE NOT NULL,
    download_count INTEGER DEFAULT 0,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE(user_id, ebook_id)
);

CREATE INDEX IF NOT EXISTS idx_ebook_licenses_token ON ebook_licenses(download_token);

-- 8. Contact & Support Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
