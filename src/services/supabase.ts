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

  // Check if this is the first user in profiles, or default to admin
  let assignedRole: 'student' | 'admin' = 'admin'; // First user or owner defaults to admin
  try {
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (count !== null && count > 0) {
      assignedRole = 'student';
    }
  } catch {
    assignedRole = 'admin';
  }

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

  let role: 'student' | 'admin' = (sbUser.user_metadata?.role as 'student' | 'admin') || 'student';
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
    } else {
      // If no admin profile exists yet in the database, promote this user to admin
      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
      if (!admins || admins.length === 0) {
        role = 'admin';
        await supabase.from('profiles').upsert({
          id: sbUser.id,
          email: sbUser.email || email,
          name,
          role: 'admin',
        });
      }
    }
  } catch {
    // Non-critical
  }

  // Check if locally claimed admin
  const locallyClaimed = localStorage.getItem(`codingthunder_admin_${sbUser.id}`);
  if (locallyClaimed === 'true') {
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
  let role: 'student' | 'admin' = (sbUser.user_metadata?.role as 'student' | 'admin') || 'student';
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
    } else {
      // Check if any admin exists
      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
      if (!admins || admins.length === 0) {
        role = 'admin';
      }
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
// SUPABASE DATABASE DATA HELPERS
// ============================================================================

export async function supabaseGetCourses(): Promise<Course[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];
    return data as Course[];
  } catch {
    return [];
  }
}

export async function supabaseGetTutorials(): Promise<Tutorial[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];
    return data as Tutorial[];
  } catch {
    return [];
  }
}

export async function supabaseGetEbooks(): Promise<Ebook[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];
    return data as Ebook[];
  } catch {
    return [];
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
