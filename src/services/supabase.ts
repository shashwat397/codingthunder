import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { Course, Tutorial, Ebook, User } from '../types/index.ts';

// Supabase environment credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if user has provided Supabase credentials
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.startsWith('https://')
  );
};

// Initialize Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ============================================================================
// SUPABASE AUTHENTICATION HELPERS
// ============================================================================

export async function supabaseSignUp(name: string, email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  if (!supabase) {
    return { user: null, session: null, error: 'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  }

  // Only the primary site owner gets auto-assigned admin; everyone else is student
  const isOwner = email.trim().toLowerCase() === 'mishrashashwat90@gmail.com';
  const assignedRole: 'student' | 'admin' = isOwner ? 'admin' : 'student';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: assignedRole,
      },
    },
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  const sbUser = data.user;
  if (!sbUser) {
    return { user: null, session: null, error: 'Registration failed to create user.' };
  }

  // Ensure profile has the assigned role
  try {
    await supabase.from('profiles').upsert({
      id: sbUser.id,
      email: sbUser.email || email,
      name,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    });
  } catch {
    // Non-critical
  }

  const mappedUser: User = {
    id: sbUser.id,
    email: sbUser.email || email,
    name: (sbUser.user_metadata?.name as string) || name,
    role: assignedRole,
    avatar: sbUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    createdAt: sbUser.created_at,
  };

  return { user: mappedUser, session: data.session, error: null };
}

export async function supabaseSignIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  if (!supabase) {
    return { user: null, session: null, error: 'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  const sbUser = data.user;
  if (!sbUser) {
    return { user: null, session: null, error: 'No user returned from login.' };
  }

  const isOwner = (sbUser.email || email).trim().toLowerCase() === 'mishrashashwat90@gmail.com';
  let role: 'student' | 'admin' = isOwner ? 'admin' : ((sbUser.user_metadata?.role as 'student' | 'admin') || 'student');
  let name = (sbUser.user_metadata?.name as string) || email.split('@')[0];

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .maybeSingle();

    if (profile?.role) {
      role = profile.role;
      if (profile.name) name = profile.name;
    }
  } catch {
    // Non-critical
  }

  // Check if locally claimed admin for this specific user ID
  if (localStorage.getItem(`codingthunder_admin_${sbUser.id}`) === 'true') {
    role = 'admin';
  }

  const mappedUser: User = {
    id: sbUser.id,
    email: sbUser.email || email,
    name,
    role,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    createdAt: sbUser.created_at,
  };

  return { user: mappedUser, session: data.session, error: null };
}

export async function supabaseSignInWithGoogle(): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase is not configured yet.' };
  }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message || 'Google OAuth failed' };
  }
}

export async function supabasePromoteToAdmin(userId: string): Promise<boolean> {
  localStorage.setItem(`codingthunder_admin_${userId}`, 'true');
  if (!supabase) return true;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
    return !error;
  } catch {
    return true;
  }
}

export async function supabaseSignOut(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

export async function supabaseGetSession(): Promise<{ user: User | null; session: Session | null }> {
  if (!supabase) return { user: null, session: null };

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    return { user: null, session: null };
  }

  const sbUser = data.session.user;
  const isOwner = (sbUser.email || '').trim().toLowerCase() === 'mishrashashwat90@gmail.com';
  let role: 'student' | 'admin' = isOwner ? 'admin' : ((sbUser.user_metadata?.role as 'student' | 'admin') || 'student');
  let name = (sbUser.user_metadata?.name as string) || sbUser.email?.split('@')[0] || 'Developer';

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .maybeSingle();

    if (profile?.role) {
      role = profile.role;
      if (profile.name) name = profile.name;
    }
  } catch {
    // Non-critical
  }

  if (localStorage.getItem(`codingthunder_admin_${sbUser.id}`) === 'true') {
    role = 'admin';
  }

  const mappedUser: User = {
    id: sbUser.id,
    email: sbUser.email || '',
    name,
    role,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(sbUser.email || '')}`,
    createdAt: sbUser.created_at,
  };

  return { user: mappedUser, session: data.session };
}

// ============================================================================
// SUPABASE DATABASE DATA HELPERS & SCHEMA CONVERTERS
// ============================================================================

export function rowToCourse(row: any): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    category: row.category,
    level: row.level || 'All Levels',
    price: Number(row.price ?? 0),
    originalPrice: Number(row.original_price ?? 0),
    isFree: Boolean(row.is_free),
    thumbnail: row.thumbnail || '',
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    rating: Number(row.rating ?? 5.0),
    reviewsCount: Number(row.reviews_count ?? 0),
    totalDuration: row.total_duration || '10h 00m',
    totalLessons: Number(row.total_lessons ?? 0),
    enrollmentsCount: Number(row.enrollments_count ?? 0),
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    whatYouWillLearn: Array.isArray(row.what_you_will_learn) ? row.what_you_will_learn : [],
    instructor: row.instructor || {
      name: 'Codingthunder Team',
      role: 'Staff Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Engineering Lead & Curriculum Director',
    },
    sections: Array.isArray(row.sections) ? row.sections : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function courseToRow(course: Partial<Course>): any {
  const row: any = { ...course };
  if (course.originalPrice !== undefined) {
    row.original_price = course.originalPrice;
    delete row.originalPrice;
  }
  if (course.isFree !== undefined) {
    row.is_free = course.isFree;
    delete row.isFree;
  }
  if (course.reviewsCount !== undefined) {
    row.reviews_count = course.reviewsCount;
    delete row.reviewsCount;
  }
  if (course.totalDuration !== undefined) {
    row.total_duration = course.totalDuration;
    delete row.totalDuration;
  }
  if (course.totalLessons !== undefined) {
    row.total_lessons = course.totalLessons;
    delete row.totalLessons;
  }
  if (course.enrollmentsCount !== undefined) {
    row.enrollments_count = course.enrollmentsCount;
    delete row.enrollmentsCount;
  }
  if (course.whatYouWillLearn !== undefined) {
    row.what_you_will_learn = course.whatYouWillLearn;
    delete row.whatYouWillLearn;
  }
  if (course.createdAt !== undefined) {
    row.created_at = course.createdAt;
    delete row.createdAt;
  }
  if (course.updatedAt !== undefined) {
    row.updated_at = course.updatedAt;
    delete row.updatedAt;
  }
  return row;
}

export function rowToEbook(row: any): Ebook {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    author: row.author || 'Codingthunder Engineering',
    description: row.description || '',
    pages: Number(row.pages ?? 200),
    price: Number(row.price ?? 499),
    originalPrice: Number(row.original_price ?? 1499),
    coverImage: row.cover_image || '',
    previewSnippet: row.preview_snippet || '',
    chapters: Array.isArray(row.chapters) ? row.chapters : [],
    features: Array.isArray(row.features) ? row.features : [],
    downloadFileName: row.download_file_name || 'handbook.pdf',
    downloadFileSize: row.download_file_size || '12 MB',
    downloadFilePath: row.download_file_path || '',
    downloadFileType: row.download_file_type || 'application/pdf',
    downloadContent: row.download_content || '',
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    salesCount: Number(row.sales_count ?? 0),
    createdAt: row.created_at,
  };
}

export function ebookToRow(ebook: Partial<Ebook>): any {
  const row: any = { ...ebook };
  if (ebook.originalPrice !== undefined) {
    row.original_price = ebook.originalPrice;
    delete row.originalPrice;
  }
  if (ebook.coverImage !== undefined) {
    row.cover_image = ebook.coverImage;
    delete row.coverImage;
  }
  if (ebook.previewSnippet !== undefined) {
    row.preview_snippet = ebook.previewSnippet;
    delete row.previewSnippet;
  }
  if (ebook.downloadFileName !== undefined) {
    row.download_file_name = ebook.downloadFileName;
    delete row.downloadFileName;
  }
  if (ebook.downloadFileSize !== undefined) {
    row.download_file_size = ebook.downloadFileSize;
    delete row.downloadFileSize;
  }
  if (ebook.downloadFilePath !== undefined) {
    row.download_file_path = ebook.downloadFilePath;
    delete row.downloadFilePath;
  }
  if (ebook.downloadFileType !== undefined) {
    row.download_file_type = ebook.downloadFileType;
    delete row.downloadFileType;
  }
  if (ebook.downloadContent !== undefined) {
    row.download_content = ebook.downloadContent;
    delete row.downloadContent;
  }
  if (ebook.salesCount !== undefined) {
    row.sales_count = ebook.salesCount;
    delete row.salesCount;
  }
  if (ebook.createdAt !== undefined) {
    row.created_at = ebook.createdAt;
    delete row.createdAt;
  }
  return row;
}

export function rowToTutorial(row: any): Tutorial {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    category: row.category || 'General',
    tags: Array.isArray(row.tags) ? row.tags : [],
    readTime: row.read_time || '10 min',
    contentMarkdown: row.content_markdown || '',
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    views: Number(row.views ?? row.views_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function tutorialToRow(tutorial: Partial<Tutorial>): any {
  const row: any = { ...tutorial };
  if (tutorial.readTime !== undefined) {
    row.read_time = tutorial.readTime;
    delete row.readTime;
  }
  if (tutorial.contentMarkdown !== undefined) {
    row.content_markdown = tutorial.contentMarkdown;
    delete row.contentMarkdown;
  }
  if (tutorial.views !== undefined) {
    row.views = tutorial.views;
    row.views_count = tutorial.views;
    delete row.views;
  }
  if (tutorial.createdAt !== undefined) {
    row.created_at = tutorial.createdAt;
    delete row.createdAt;
  }
  if (tutorial.updatedAt !== undefined) {
    row.updated_at = tutorial.updatedAt;
    delete row.updatedAt;
  }
  return row;
}

export async function supabaseGetCourses(all = false): Promise<Course[]> {
  if (!supabase) return [];
  try {
    let query = supabase.from('courses').select('*');
    if (!all) {
      query = query.eq('published', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(rowToCourse);
  } catch {
    return [];
  }
}

export async function supabaseSaveCourse(course: Course): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const row = courseToRow(course);
    const { error } = await supabase.from('courses').upsert(row);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseGetTutorials(all = false): Promise<Tutorial[]> {
  if (!supabase) return [];
  try {
    let query = supabase.from('tutorials').select('*');
    if (!all) {
      query = query.eq('published', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(rowToTutorial);
  } catch {
    return [];
  }
}

export async function supabaseSaveTutorial(tutorial: Tutorial): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const row = tutorialToRow(tutorial);
    const { error } = await supabase.from('tutorials').upsert(row);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteTutorial(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.from('tutorials').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseGetEbooks(all = false): Promise<Ebook[]> {
  if (!supabase) return [];
  try {
    let query = supabase.from('ebooks').select('*');
    if (!all) {
      query = query.eq('published', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(rowToEbook);
  } catch {
    return [];
  }
}

export async function supabaseSaveEbook(ebook: Ebook): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const row = ebookToRow(ebook);
    const { error } = await supabase.from('ebooks').upsert(row);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteEbook(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.from('ebooks').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function supabaseSaveProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  percentage: number
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existing) {
      const completedSet = new Set<string>(existing.completed_lesson_ids || []);
      completedSet.add(lessonId);
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress_percentage: Math.max(existing.progress_percentage || 0, percentage),
          completed_lesson_ids: Array.from(completedSet),
          last_watched_lesson_id: lessonId,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      return !error;
    }
    return false;
  } catch {
    return false;
  }
}
