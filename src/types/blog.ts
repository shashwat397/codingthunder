export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML / Rich Text
  excerpt: string;
  featuredImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  authorBio?: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
  readTime: string; // e.g. "7 min read"
  views: number;
  featured?: boolean;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  authorRole?: string;
  authorBio?: string;
  category?: string;
  tags?: string[];
  status?: BlogPostStatus;
  seoDescription?: string;
  featured?: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

/**
 * =========================================================================
 * DATABASE SCHEMAS (PostgreSQL DDL & Prisma ORM Schema Reference)
 * =========================================================================
 * 
 * -- 1. PostgreSQL DDL:
 * CREATE TABLE blog_posts (
 *   id VARCHAR(64) PRIMARY KEY,
 *   title VARCHAR(255) NOT NULL,
 *   slug VARCHAR(255) UNIQUE NOT NULL,
 *   content TEXT NOT NULL,
 *   excerpt TEXT NOT NULL,
 *   featured_image TEXT NOT NULL,
 *   author_id VARCHAR(64) NOT NULL,
 *   author_name VARCHAR(120) NOT NULL,
 *   author_avatar TEXT NOT NULL,
 *   author_role VARCHAR(120),
 *   author_bio TEXT,
 *   category VARCHAR(80) NOT NULL,
 *   tags TEXT[] NOT NULL DEFAULT '{}',
 *   status VARCHAR(20) NOT NULL DEFAULT 'draft',
 *   read_time VARCHAR(30) NOT NULL,
 *   views INTEGER NOT NULL DEFAULT 0,
 *   featured BOOLEAN NOT NULL DEFAULT FALSE,
 *   seo_description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
 * CREATE INDEX idx_blog_posts_status ON blog_posts(status);
 * CREATE INDEX idx_blog_posts_category ON blog_posts(category);
 * 
 * -- 2. Prisma ORM:
 * model BlogPost {
 *   id            String   @id @default(cuid())
 *   title         String
 *   slug          String   @unique
 *   content       String   @db.Text
 *   excerpt       String   @db.Text
 *   featuredImage String
 *   authorId      String
 *   authorName    String
 *   authorAvatar  String
 *   authorRole    String?
 *   authorBio     String?
 *   category      String
 *   tags          String[]
 *   status        String   @default("draft")
 *   readTime      String
 *   views         Int      @default(0)
 *   featured      Boolean  @default(false)
 *   seoDescription String?
 *   createdAt     DateTime @default(now())
 *   updatedAt     DateTime @updatedAt
 *   @@index([slug])
 *   @@index([status])
 *   @@index([category])
 * }
 */
