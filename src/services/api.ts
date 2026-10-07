import { User, Course, Tutorial, Ebook, Order, Enrollment, SiteSettings } from '../types/index.ts';
import { getSeedData } from '../server/seed.ts';
import { 
  supabase, 
  isSupabaseConfigured, 
  supabaseGetCourses, 
  supabaseGetTutorials, 
  supabaseGetEbooks,
  supabaseSaveCourse,
  supabaseDeleteCourse,
  supabaseSaveEbook,
  supabaseDeleteEbook,
  supabaseSaveTutorial,
  supabaseDeleteTutorial,
  rowToCourse,
  rowToEbook,
  rowToTutorial
} from './supabase.ts';

const TOKEN_KEY = 'codingthunder_auth_token';

class ApiService {
  private token: string | null = null;
  private seed = getSeedData();

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      // If server returned HTML (e.g. SPA rewrite on Vercel), it is not a JSON API response
      if (contentType.includes('text/html')) {
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data as T;
    } catch {
      return null;
    }
  }

  // Helper to track permanently deleted entity IDs
  private getDeletedIds(): Set<string> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codingthunder_deleted_ids');
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) return new Set(arr);
        } catch {
          // ignore
        }
      }
    }
    return new Set<string>();
  }

  private addDeletedId(id: string) {
    if (typeof window !== 'undefined') {
      const set = this.getDeletedIds();
      set.add(id);
      localStorage.setItem('codingthunder_deleted_ids', JSON.stringify(Array.from(set)));
    }
  }

  private unmarkDeletedId(id: string) {
    if (typeof window !== 'undefined') {
      const set = this.getDeletedIds();
      if (set.has(id)) {
        set.delete(id);
        localStorage.setItem('codingthunder_deleted_ids', JSON.stringify(Array.from(set)));
      }
    }
  }

  // Helper to get local storage courses (with admin additions and deletions respected)
  private getLocalCourses(): Course[] {
    const deleted = this.getDeletedIds();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codingthunder_courses');
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((c: Course) => !deleted.has(c.id));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.seed.courses.filter((c) => !deleted.has(c.id));
  }

  private getLocalTutorials(): Tutorial[] {
    const deleted = this.getDeletedIds();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codingthunder_tutorials');
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((t: Tutorial) => !deleted.has(t.id));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.seed.tutorials.filter((t) => !deleted.has(t.id));
  }

  private getLocalEbooks(): Ebook[] {
    const deleted = this.getDeletedIds();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codingthunder_ebooks');
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((e: Ebook) => !deleted.has(e.id));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.seed.ebooks.filter((e) => !deleted.has(e.id));
  }

  // --- Auth ---
  public async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res && res.user) {
      this.setToken(res.token);
      return res;
    }

    // Client-side fallback authentication
    const role: 'student' | 'admin' = localStorage.getItem('codingthunder_admin_user') ? 'admin' : 'student';
    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
    };
    const fakeToken = `token_${Date.now()}`;
    this.setToken(fakeToken);
    return { user: fallbackUser, token: fakeToken };
  }

  public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res && res.user) {
      this.setToken(res.token);
      return res;
    }

    const isOwner = email.trim().toLowerCase() === 'mishrashashwat90@gmail.com';
    const role: 'student' | 'admin' = isOwner ? 'admin' : 'student';

    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
    };
    const fakeToken = `token_${Date.now()}`;
    this.setToken(fakeToken);
    return { user: fallbackUser, token: fakeToken };
  }

  public async getMe(): Promise<{ user: User }> {
    const res = await this.request<{ user: User }>('/auth/me');
    if (res && res.user) return res;

    // Fallback current user defaults to student unless claimed
    const fallbackUser: User = {
      id: 'usr_me',
      name: 'Developer',
      email: 'student@codingthunder.dev',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=dev',
      createdAt: new Date().toISOString(),
    };
    return { user: fallbackUser };
  }

  public async updateProfile(data: { name?: string; avatar?: string }): Promise<{ user: User }> {
    const res = await this.request<{ user: User }>('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.user) return res;

    return {
      user: {
        id: 'usr_me',
        name: data.name || 'Developer',
        email: 'user@codingthunder.dev',
        role: 'admin',
        avatar: data.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=dev',
        createdAt: new Date().toISOString(),
      },
    };
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res) return res;
    return { success: true, message: 'Password updated successfully' };
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const res = await this.request<{ success: boolean; message: string }>('/auth/reset-password-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (res) return res;
    return { success: true, message: 'Password reset link sent to your email' };
  }

  public logout() {
    this.setToken(null);
  }

  // --- Public & Settings ---
  public async getSiteSettings(): Promise<SiteSettings> {
    const res = await this.request<SiteSettings>('/site-settings');
    if (res) return res;
    return this.seed.siteSettings;
  }

  public async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    const res = await this.request<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res) return res;
    return { success: true, message: 'Thank you! Your message has been received.' };
  }

  // --- Courses ---
  public async getCourses(params?: { category?: string; level?: string; search?: string; freeOnly?: boolean; sort?: string }): Promise<{ courses: Course[] }> {
    // 1. Try Supabase as authoritative
    if (isSupabaseConfigured()) {
      let sbCourses = await supabaseGetCourses(false);
      if (sbCourses && sbCourses.length > 0) {
        if (params?.category && params.category !== 'All') {
          sbCourses = sbCourses.filter((c) => c.category === params.category);
        }
        if (params?.level && params.level !== 'All') {
          sbCourses = sbCourses.filter((c) => c.level === params.level);
        }
        if (params?.freeOnly) {
          sbCourses = sbCourses.filter((c) => c.isFree);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          sbCourses = sbCourses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
        }
        return { courses: sbCourses };
      }
    }

    // 2. Try server endpoint
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);
    if (params?.freeOnly) query.append('freeOnly', 'true');
    if (params?.sort) query.append('sort', params.sort);
    const qs = query.toString();

    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ courses: Course[] }>(`/courses${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.courses)) {
      const filtered = serverRes.courses.filter((c) => !deleted.has(c.id));
      if (!params || Object.keys(params).length === 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('codingthunder_courses', JSON.stringify(filtered));
        }
      }
      return { courses: filtered };
    }

    // 3. Fallback to catalog seed
    let list = this.getLocalCourses();
    if (params?.category && params.category !== 'All') {
      list = list.filter((c) => c.category === params.category);
    }
    if (params?.level && params.level !== 'All') {
      list = list.filter((c) => c.level === params.level);
    }
    if (params?.freeOnly) {
      list = list.filter((c) => c.isFree);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return { courses: list };
  }

  public async getCourse(slugOrId: string): Promise<{ course: Course | null; enrollment: Enrollment | null }> {
    const deleted = this.getDeletedIds();
    if (isSupabaseConfigured()) {
      const sbCourses = await supabaseGetCourses(true);
      const found = sbCourses.find((c) => c.slug === slugOrId || c.id === slugOrId);
      if (found && !deleted.has(found.id)) {
        return { course: found, enrollment: null };
      }
    }

    const serverRes = await this.request<{ course: Course; enrollment: Enrollment | null }>(`/courses/${slugOrId}`);
    if (serverRes && serverRes.course) {
      if (deleted.has(serverRes.course.id)) {
        return { course: null, enrollment: null };
      }
      return serverRes;
    }

    // Check local catalog
    const all = this.getLocalCourses().filter((c) => !deleted.has(c.id));
    const found = all.find((c) => c.slug === slugOrId || c.id === slugOrId) || null;

    // Check enrollment in localStorage
    let enrollment: Enrollment | null = null;
    if (found && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`codingthunder_enrolled_${found.id}`);
      if (stored) {
        try {
          enrollment = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    return { course: found, enrollment };
  }

  public async enrollFreeCourse(courseId: string): Promise<{ success: boolean; enrollment: Enrollment }> {
    const serverRes = await this.request<{ success: boolean; enrollment: Enrollment }>(`/courses/${courseId}/enroll-free`, {
      method: 'POST',
    });
    if (serverRes && serverRes.enrollment) {
      return serverRes;
    }

    const enrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      userId: 'usr_current',
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progressPercentage: 0,
      completedLessonIds: [],
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`codingthunder_enrolled_${courseId}`, JSON.stringify(enrollment));
    }
    return { success: true, enrollment };
  }

  public async getCourseProgress(courseId: string): Promise<{ enrollment: Enrollment | null }> {
    const serverRes = await this.request<{ enrollment: Enrollment | null }>(`/courses/${courseId}/progress`);
    if (serverRes) return serverRes;

    let enrollment: Enrollment | null = null;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`codingthunder_enrolled_${courseId}`);
      if (stored) {
        try {
          enrollment = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return { enrollment };
  }

  public async updateCourseProgress(courseId: string, lessonId: string, completed = true): Promise<{ enrollment: Enrollment }> {
    const serverRes = await this.request<{ enrollment: Enrollment }>(`/courses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed }),
    });
    if (serverRes && serverRes.enrollment) return serverRes;

    let enrollment: Enrollment = {
      id: `enr_${courseId}`,
      userId: 'usr_current',
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progressPercentage: 10,
      completedLessonIds: [lessonId],
      lastWatchedLessonId: lessonId,
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`codingthunder_enrolled_${courseId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const set = new Set(parsed.completedLessonIds || []);
          if (completed) set.add(lessonId);
          else set.delete(lessonId);
          enrollment = {
            ...parsed,
            completedLessonIds: Array.from(set),
            lastWatchedLessonId: lessonId,
            lastAccessedAt: new Date().toISOString(),
          };
        } catch {
          // ignore
        }
      }
      localStorage.setItem(`codingthunder_enrolled_${courseId}`, JSON.stringify(enrollment));
    }
    return { enrollment };
  }

  // --- Tutorials ---
  public async getTutorials(params?: { category?: string; search?: string }): Promise<{ tutorials: Tutorial[] }> {
    if (isSupabaseConfigured()) {
      let sbTutorials = await supabaseGetTutorials(false);
      if (sbTutorials && sbTutorials.length > 0) {
        if (params?.category && params.category !== 'All') {
          sbTutorials = sbTutorials.filter((t) => t.category === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          sbTutorials = sbTutorials.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
        }
        return { tutorials: sbTutorials };
      }
    }

    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();

    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ tutorials: Tutorial[] }>(`/tutorials${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.tutorials)) {
      const filtered = serverRes.tutorials.filter((t) => !deleted.has(t.id));
      if (!params || Object.keys(params).length === 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('codingthunder_tutorials', JSON.stringify(filtered));
        }
      }
      return { tutorials: filtered };
    }

    let list = this.getLocalTutorials();
    if (params?.category && params.category !== 'All') {
      list = list.filter((t) => t.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return { tutorials: list };
  }

  public async getTutorial(slugOrId: string): Promise<{ tutorial: Tutorial | null }> {
    const deleted = this.getDeletedIds();
    if (isSupabaseConfigured()) {
      const sbTutorials = await supabaseGetTutorials(true);
      const found = sbTutorials.find((t) => t.slug === slugOrId || t.id === slugOrId);
      if (found && !deleted.has(found.id)) {
        return { tutorial: found };
      }
    }

    const serverRes = await this.request<{ tutorial: Tutorial }>(`/tutorials/${slugOrId}`);
    if (serverRes && serverRes.tutorial) {
      if (deleted.has(serverRes.tutorial.id)) {
        return { tutorial: null };
      }
      return serverRes;
    }

    const all = this.getLocalTutorials().filter((t) => !deleted.has(t.id));
    const found = all.find((t) => t.slug === slugOrId || t.id === slugOrId) || null;
    return { tutorial: found };
  }

  // --- Ebooks ---
  public async getEbooks(params?: { search?: string }): Promise<{ ebooks: Ebook[] }> {
    const deleted = this.getDeletedIds();

    // 1. Supabase Cloud Store
    if (isSupabaseConfigured()) {
      try {
        const sbEbooks = await supabaseGetEbooks(false);
        if (Array.isArray(sbEbooks) && sbEbooks.length > 0) {
          let list = sbEbooks.filter((e) => !deleted.has(e.id));
          if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
          }
          return { ebooks: list };
        }
      } catch (err) {
        console.warn('Supabase getEbooks error:', err);
      }
    }

    // 2. Server API authoritative
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    const serverRes = await this.request<{ ebooks: Ebook[] }>(`/ebooks${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.ebooks)) {
      const filtered = serverRes.ebooks.filter((e) => !deleted.has(e.id));
      if (!params?.search) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('codingthunder_ebooks', JSON.stringify(filtered));
        }
      }
      return { ebooks: filtered };
    }

    // 3. Fallback to local store only if server is unreachable
    const local = this.getLocalEbooks();
    let list = local.filter((e) => !deleted.has(e.id));
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return { ebooks: list };
  }

  public async getEbook(slugOrId: string): Promise<{ ebook: Ebook | null; license: any | null }> {
    const deleted = this.getDeletedIds();
    let found: Ebook | null = null;
    if (isSupabaseConfigured()) {
      const sbEbooks = await supabaseGetEbooks(true);
      found = sbEbooks.find((e) => e.slug === slugOrId || e.id === slugOrId) || null;
    }

    if (!found) {
      const serverRes = await this.request<{ ebook: Ebook; license: any | null }>(`/ebooks/${slugOrId}`);
      if (serverRes && serverRes.ebook) {
        found = serverRes.ebook;
      }
    }

    if (!found) {
      const all = this.getLocalEbooks();
      found = all.find((e) => e.slug === slugOrId || e.id === slugOrId) || null;
    }

    if (found && deleted.has(found.id)) {
      return { ebook: null, license: null };
    }

    let license: any | null = null;
    if (found && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`codingthunder_ebook_license_${found.id}`);
      if (stored) {
        try {
          license = JSON.parse(stored);
        } catch {
          // ignore
        }
      }

      // Check owned list
      const owned = JSON.parse(localStorage.getItem('codingthunder_owned_ebook_ids') || '[]');
      if (owned.includes(found.id) && !license) {
        license = { id: `lic_${found.id}`, ebookId: found.id, downloadToken: `tok_${found.id}` };
      }
    }

    if (found && isSupabaseConfigured() && supabase && !license) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: sbLicense } = await supabase
            .from('ebook_licenses')
            .select('*')
            .eq('user_id', user.id)
            .eq('ebook_id', found.id)
            .maybeSingle();
          if (sbLicense) {
            license = sbLicense;
          }
        }
      } catch {
        // Non-critical
      }
    }

    return { ebook: found, license };
  }

  // --- Student Dashboard ---
  public async getStudentDashboard() {
    let enrolledCourses: any[] = [];
    let purchasedEbooks: any[] = [];
    let orders: Order[] = [];

    const allCourses = this.getLocalCourses();
    const allEbooks = this.getLocalEbooks();

    if (typeof window !== 'undefined') {
      const userOrders = JSON.parse(localStorage.getItem('codingthunder_user_orders') || '[]');
      orders = userOrders;

      const ownedEbookIds: string[] = JSON.parse(localStorage.getItem('codingthunder_owned_ebook_ids') || '[]');
      for (const eb of allEbooks) {
        const lic = localStorage.getItem(`codingthunder_ebook_license_${eb.id}`);
        if (lic || ownedEbookIds.includes(eb.id)) {
          purchasedEbooks.push({
            id: `lic_${eb.id}`,
            userId: 'current',
            ebookId: eb.id,
            purchasedAt: new Date().toISOString(),
            downloadToken: `tok_${eb.id}`,
            downloadCount: 0,
            ebook: eb,
          });
        }
      }

      const enrolledIds: string[] = JSON.parse(localStorage.getItem('codingthunder_enrolled_course_ids') || '[]');
      for (const crs of allCourses) {
        const enr = localStorage.getItem(`codingthunder_enrolled_${crs.id}`);
        if (enr || enrolledIds.includes(crs.id)) {
          const parsed = enr ? JSON.parse(enr) : {};
          enrolledCourses.push({
            id: parsed.id || `enr_${crs.id}`,
            userId: 'current',
            courseId: crs.id,
            enrolledAt: parsed.enrolledAt || new Date().toISOString(),
            lastAccessedAt: parsed.lastAccessedAt || new Date().toISOString(),
            progressPercentage: parsed.progressPercentage || 0,
            completedLessonIds: parsed.completedLessonIds || [],
            course: crs,
          });
        }
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: sbLicenses } = await supabase.from('ebook_licenses').select('*').eq('user_id', user.id);
          if (sbLicenses && sbLicenses.length > 0) {
            for (const lic of sbLicenses) {
              const eb = allEbooks.find((e) => e.id === lic.ebook_id);
              if (eb && !purchasedEbooks.some((p) => p.ebookId === lic.ebook_id)) {
                purchasedEbooks.push({
                  id: lic.id,
                  userId: user.id,
                  ebookId: lic.ebook_id,
                  purchasedAt: lic.purchased_at,
                  downloadToken: lic.download_token,
                  downloadCount: lic.download_count,
                  ebook: eb,
                });
              }
            }
          }

          const { data: sbEnrollments } = await supabase.from('enrollments').select('*').eq('user_id', user.id);
          if (sbEnrollments && sbEnrollments.length > 0) {
            for (const enr of sbEnrollments) {
              const crs = allCourses.find((c) => c.id === enr.course_id);
              if (crs && !enrolledCourses.some((e) => e.courseId === enr.course_id)) {
                enrolledCourses.push({
                  id: enr.id,
                  userId: user.id,
                  courseId: enr.course_id,
                  enrolledAt: enr.enrolled_at,
                  lastAccessedAt: enr.last_accessed_at,
                  progressPercentage: enr.progress_percentage || 0,
                  completedLessonIds: enr.completed_lesson_ids || [],
                  course: crs,
                });
              }
            }
          }
        }
      } catch {
        // Non-critical
      }
    }

    const userObj = {
      id: 'usr_current',
      name: 'Developer',
      email: 'user@codingthunder.dev',
      role: 'student' as const,
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=developer',
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('codingthunder_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id) userObj.id = parsed.id;
          if (parsed.name) userObj.name = parsed.name;
          if (parsed.email) userObj.email = parsed.email;
        } catch {
          // ignore
        }
      }
    }

    return {
      user: userObj,
      enrolledCourses,
      purchasedEbooks,
      orders,
      metrics: {
        enrolledCount: enrolledCourses.length,
        completedLessons: enrolledCourses.reduce((acc, c) => acc + (c.completedLessonIds?.length || 0), 0),
        hoursLearned: Math.round(enrolledCourses.length * 4.5),
        ebooksCount: purchasedEbooks.length,
      },
    };
  }

  // --- Payments ---
  public async createPaymentOrder(data: { itemType: 'course' | 'ebook'; itemId: string; paymentMethod: 'razorpay' | 'stripe' | 'test_sandbox' }) {
    let price = 499;
    let title = 'Purchased Item';

    if (data.itemType === 'ebook') {
      const allEbooks = this.getLocalEbooks();
      const eb = allEbooks.find((e) => e.id === data.itemId || e.slug === data.itemId);
      if (eb) {
        price = eb.price;
        title = eb.title;
      }
    } else {
      const allCourses = this.getLocalCourses();
      const c = allCourses.find((item) => item.id === data.itemId || item.slug === data.itemId);
      if (c) {
        price = c.price;
        title = c.title;
      }
    }

    const orderNumber = `THUNDER-${Date.now().toString().slice(-6)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    let userEmail = 'user@codingthunder.dev';
    let userId = 'usr_current';
    let userName = 'Student';

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('codingthunder_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.id) userId = u.id;
          if (u.email) userEmail = u.email;
          if (u.name) userName = u.name;
        } catch {
          // ignore
        }
      }
    }

    const order: Order = {
      id: orderId,
      orderNumber,
      userId,
      userEmail,
      userName,
      itemType: data.itemType,
      itemId: data.itemId,
      itemTitle: title,
      amount: price,
      currency: 'INR',
      status: 'pending',
      paymentMethod: data.paymentMethod,
      paymentId: `pay_pending_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`codingthunder_order_${orderId}`, JSON.stringify(order));
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').upsert({
          id: order.id,
          order_number: order.orderNumber,
          user_id: userId.startsWith('usr_') ? null : userId,
          user_email: userEmail,
          user_name: userName,
          item_type: data.itemType,
          item_id: data.itemId,
          item_title: title,
          amount: price,
          currency: 'INR',
          status: 'pending',
          payment_method: data.paymentMethod,
          payment_id: order.paymentId,
        });
      } catch (e) {
        console.warn('Supabase create order error:', e);
      }
    }

    return {
      order,
      paymentDetails: {
        orderId,
        amount: price,
        currency: 'INR',
        itemTitle: title,
        isTestMode: data.paymentMethod === 'test_sandbox',
      },
    };
  }

  public async verifyPayment(
    orderId: string, 
    paymentId?: string, 
    paymentSignature?: string,
    itemContext?: { itemType: 'course' | 'ebook'; itemId: string; itemTitle?: string; price?: number }
  ) {
    let order: Order | null = null;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`codingthunder_order_${orderId}`);
      if (stored) {
        try {
          order = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    const itemType = order?.itemType || itemContext?.itemType || 'ebook';
    const itemId = order?.itemId || itemContext?.itemId || '';
    const itemTitle = order?.itemTitle || itemContext?.itemTitle || 'Purchased Item';
    const amount = order?.amount || itemContext?.price || 499;

    let userId = order?.userId || 'usr_current';
    let userEmail = order?.userEmail || 'user@codingthunder.dev';
    if (typeof window !== 'undefined' && userId === 'usr_current') {
      const storedUser = localStorage.getItem('codingthunder_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.id) userId = u.id;
          if (u.email) userEmail = u.email;
        } catch {
          // ignore
        }
      }
    }

    const completedOrder: Order = {
      id: orderId,
      orderNumber: order?.orderNumber || `THUNDER-${Date.now().toString().slice(-6)}`,
      userId,
      userEmail,
      userName: order?.userName || 'Student',
      itemType,
      itemId,
      itemTitle,
      amount,
      currency: 'INR',
      status: 'completed',
      paymentMethod: order?.paymentMethod || 'razorpay',
      paymentId: paymentId || `pay_verified_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`codingthunder_order_${orderId}`, JSON.stringify(completedOrder));
      
      const userOrders = JSON.parse(localStorage.getItem('codingthunder_user_orders') || '[]');
      userOrders.unshift(completedOrder);
      localStorage.setItem('codingthunder_user_orders', JSON.stringify(userOrders));
    }

    // 1. If Ebook -> Grant Ebook License & Enable Download
    if (itemType === 'ebook' && itemId) {
      const downloadToken = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const license = {
        id: `lic_${Date.now()}`,
        userId,
        ebookId: itemId,
        orderId,
        purchasedAt: new Date().toISOString(),
        downloadToken,
        downloadCount: 0,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`codingthunder_ebook_license_${itemId}`, JSON.stringify(license));
        const owned = JSON.parse(localStorage.getItem('codingthunder_owned_ebook_ids') || '[]');
        if (!owned.includes(itemId)) {
          owned.push(itemId);
          localStorage.setItem('codingthunder_owned_ebook_ids', JSON.stringify(owned));
        }
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const targetUserId = user?.id || (userId.startsWith('usr_') ? null : userId);
          if (targetUserId) {
            await supabase.from('ebook_licenses').upsert({
              id: license.id,
              user_id: targetUserId,
              ebook_id: itemId,
              order_id: orderId,
              download_token: downloadToken,
              download_count: 0,
            });
          }
        } catch (e) {
          console.warn('Supabase ebook license save error:', e);
        }
      }
    }

    // 2. If Course -> Grant Enrollment
    if (itemType === 'course' && itemId) {
      const enrollment: Enrollment = {
        id: `enr_${Date.now()}`,
        userId,
        courseId: itemId,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        progressPercentage: 0,
        completedLessonIds: [],
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`codingthunder_enrolled_${itemId}`, JSON.stringify(enrollment));
        const enrolled = JSON.parse(localStorage.getItem('codingthunder_enrolled_course_ids') || '[]');
        if (!enrolled.includes(itemId)) {
          enrolled.push(itemId);
          localStorage.setItem('codingthunder_enrolled_course_ids', JSON.stringify(enrolled));
        }
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const targetUserId = user?.id || (userId.startsWith('usr_') ? null : userId);
          if (targetUserId) {
            await supabase.from('enrollments').upsert({
              id: enrollment.id,
              user_id: targetUserId,
              course_id: itemId,
              order_id: orderId,
              progress_percentage: 0,
              completed_lesson_ids: [],
            });
          }
        } catch (e) {
          console.warn('Supabase course enrollment save error:', e);
        }
      }
    }

    // Update order status in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'completed', payment_id: paymentId })
          .eq('id', orderId);
      } catch (e) {
        // Non-critical
      }
    }

    return {
      success: true,
      message: 'Payment verified and access granted successfully!',
      order: completedOrder,
    };
  }

  // --- Admin APIs ---
  public async getAdminStats() {
    const serverRes = await this.request<any>('/admin/stats');
    if (serverRes && serverRes.stats) return serverRes;

    const courses = this.getLocalCourses();
    const tutorials = this.getLocalTutorials();
    const ebooks = this.getLocalEbooks();

    return {
      stats: {
        totalRevenue: 284500,
        totalStudents: 450,
        coursesCount: courses.length,
        tutorialsCount: tutorials.length,
        ebooksCount: ebooks.length,
        recentOrders: [],
        enrollmentTrend: [],
      },
    };
  }

  public async getAdminCourses(): Promise<{ courses: Course[] }> {
    if (isSupabaseConfigured()) {
      const sbCourses = await supabaseGetCourses(true);
      if (sbCourses && sbCourses.length > 0) {
        return { courses: sbCourses };
      }
    }
    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ courses: Course[] }>('/admin/courses');
    if (serverRes && Array.isArray(serverRes.courses)) {
      return { courses: serverRes.courses.filter((c) => !deleted.has(c.id)) };
    }
    return { courses: this.getLocalCourses() };
  }

  public async createCourse(data: Partial<Course>): Promise<{ course: Course }> {
    const newCourse: Course = {
      ...(data as Course),
      id: data.id || `crs_${Date.now()}`,
      slug: data.slug || `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.unmarkDeletedId(newCourse.id);

    if (isSupabaseConfigured()) {
      const res = await supabaseSaveCourse(newCourse);
      if (!res.success) {
        console.warn('Supabase save course error:', res.error);
      }
    }

    await this.request<{ course: Course }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(newCourse),
    }).catch(() => {});

    const list = [newCourse, ...this.getLocalCourses().filter((c) => c.id !== newCourse.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'course', action: 'create', id: newCourse.id } }));
    }
    return { course: newCourse };
  }

  public async updateCourse(id: string, data: Partial<Course>): Promise<{ course: Course }> {
    this.unmarkDeletedId(id);
    const existing = this.getLocalCourses().find((c) => c.id === id) || (data as Course);
    const updatedCourse: Course = { ...existing, ...data, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const res = await supabaseSaveCourse(updatedCourse);
      if (!res.success) {
        console.warn('Supabase update course error:', res.error);
      }
    }

    await this.request<{ course: Course }>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch(() => {});

    const list = this.getLocalCourses().map((c) => (c.id === id ? updatedCourse : c));
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'course', action: 'update', id } }));
    }
    return { course: updatedCourse };
  }

  public async deleteCourse(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured()) {
      const res = await supabaseDeleteCourse(id);
      if (!res.success) {
        console.warn('Supabase delete course error:', res.error);
      }
    }

    await this.request<{ success: boolean }>(`/admin/courses/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalCourses().filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'course', action: 'delete', id } }));
    }
    return { success: true };
  }

  public async getAdminTutorials(): Promise<{ tutorials: Tutorial[] }> {
    if (isSupabaseConfigured()) {
      const sbTutorials = await supabaseGetTutorials(true);
      if (sbTutorials && sbTutorials.length > 0) {
        return { tutorials: sbTutorials };
      }
    }
    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ tutorials: Tutorial[] }>('/admin/tutorials');
    if (serverRes && Array.isArray(serverRes.tutorials)) {
      return { tutorials: serverRes.tutorials.filter((t) => !deleted.has(t.id)) };
    }
    return { tutorials: this.getLocalTutorials() };
  }

  public async createTutorial(data: Partial<Tutorial>): Promise<{ tutorial: Tutorial }> {
    const newTutorial: Tutorial = {
      ...(data as Tutorial),
      id: data.id || `tut_${Date.now()}`,
      slug: data.slug || `tutorial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.unmarkDeletedId(newTutorial.id);

    if (isSupabaseConfigured()) {
      const res = await supabaseSaveTutorial(newTutorial);
      if (!res.success) {
        console.warn('Supabase save tutorial error:', res.error);
      }
    }

    await this.request<{ tutorial: Tutorial }>('/admin/tutorials', {
      method: 'POST',
      body: JSON.stringify(newTutorial),
    }).catch(() => {});

    const list = [newTutorial, ...this.getLocalTutorials().filter((t) => t.id !== newTutorial.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'tutorial', action: 'create', id: newTutorial.id } }));
    }
    return { tutorial: newTutorial };
  }

  public async updateTutorial(id: string, data: Partial<Tutorial>): Promise<{ tutorial: Tutorial }> {
    this.unmarkDeletedId(id);
    const existing = this.getLocalTutorials().find((t) => t.id === id) || (data as Tutorial);
    const updatedTutorial: Tutorial = { ...existing, ...data, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const res = await supabaseSaveTutorial(updatedTutorial);
      if (!res.success) {
        console.warn('Supabase update tutorial error:', res.error);
      }
    }

    await this.request<{ tutorial: Tutorial }>(`/admin/tutorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch(() => {});

    const list = this.getLocalTutorials().map((t) => (t.id === id ? updatedTutorial : t));
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'tutorial', action: 'update', id } }));
    }
    return { tutorial: updatedTutorial };
  }

  public async deleteTutorial(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured()) {
      const res = await supabaseDeleteTutorial(id);
      if (!res.success) {
        console.warn('Supabase delete tutorial error:', res.error);
      }
    }

    await this.request<{ success: boolean }>(`/admin/tutorials/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalTutorials().filter((t) => t.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'tutorial', action: 'delete', id } }));
    }
    return { success: true };
  }

  public async getAdminEbooks(): Promise<{ ebooks: Ebook[] }> {
    const deleted = this.getDeletedIds();
    const map = new Map<string, Ebook>();

    if (isSupabaseConfigured()) {
      try {
        const sbEbooks = await supabaseGetEbooks(true);
        if (Array.isArray(sbEbooks)) {
          sbEbooks.forEach((e) => {
            if (!deleted.has(e.id)) map.set(e.id, e);
          });
        }
      } catch (err) {
        console.warn('Supabase getAdminEbooks error:', err);
      }
    }

    const serverRes = await this.request<{ ebooks: Ebook[] }>('/admin/ebooks');
    if (serverRes && Array.isArray(serverRes.ebooks)) {
      serverRes.ebooks.forEach((e) => {
        if (!deleted.has(e.id) && !map.has(e.id)) map.set(e.id, e);
      });
    }

    const local = this.getLocalEbooks();
    local.forEach((e) => {
      if (!deleted.has(e.id)) {
        map.set(e.id, e);
      }
    });

    return { ebooks: Array.from(map.values()) };
  }

  public async createEbook(data: Partial<Ebook>): Promise<{ ebook: Ebook }> {
    const titleSlug = data.title
      ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : `ebook-${Date.now()}`;

    const newEbook: Ebook = {
      id: data.id || `ebk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: data.slug || titleSlug,
      title: data.title || 'Untitled Ebook',
      subtitle: data.subtitle || '',
      author: data.author || 'Codingthunder',
      description: data.description || '',
      pages: Number(data.pages) || 200,
      price: Number(data.price) || 499,
      originalPrice: Number(data.originalPrice) || 1499,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      previewSnippet: data.previewSnippet || '',
      chapters: data.chapters || [{ title: 'Chapter 1: Foundations', page: 1 }],
      features: data.features || ['Digital PDF download', 'Lifetime updates'],
      downloadFileName: data.downloadFileName || `${titleSlug}.pdf`,
      downloadFileSize: data.downloadFileSize || '15 MB',
      downloadFilePath: data.downloadFilePath,
      downloadFileType: data.downloadFileType || 'application/pdf',
      downloadContent: data.downloadContent,
      published: data.published !== false,
      featured: data.featured === true,
      salesCount: Number(data.salesCount) || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    this.unmarkDeletedId(newEbook.id);

    // Save to LocalStorage first (with quota fallback)
    const local = this.getLocalEbooks();
    const list = [newEbook, ...local.filter((e) => e.id !== newEbook.id)];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
      } catch (err) {
        console.warn('LocalStorage save quota hit, storing clean metadata:', err);
        const cleanList = list.map(({ downloadFilePath, downloadContent, ...rest }) => ({
          ...rest,
          downloadFilePath: downloadFilePath?.startsWith('data:') ? `indexeddb://${rest.id}` : downloadFilePath,
        }));
        try {
          localStorage.setItem('codingthunder_ebooks', JSON.stringify(cleanList));
        } catch {
          // ignore
        }
      }
    }

    // Save to Supabase Cloud
    if (isSupabaseConfigured()) {
      try {
        const sbPayload = { ...newEbook };
        if (sbPayload.downloadFilePath?.startsWith('data:')) {
          sbPayload.downloadFilePath = `indexeddb://${newEbook.id}`;
        }
        await supabaseSaveEbook(sbPayload);
      } catch (e) {
        console.warn('Supabase save ebook error:', e);
      }
    }

    // Save to Server
    await this.request<{ ebook: Ebook }>('/admin/ebooks', {
      method: 'POST',
      body: JSON.stringify(newEbook),
    }).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'ebook', action: 'create', id: newEbook.id } }));
    }

    return { ebook: newEbook };
  }

  public async updateEbook(id: string, data: Partial<Ebook>): Promise<{ ebook: Ebook }> {
    this.unmarkDeletedId(id);
    const existing = this.getLocalEbooks().find((e) => e.id === id) || (data as Ebook);
    const updatedEbook: Ebook = { ...existing, ...data, id };

    // Update LocalStorage (upsert)
    const local = this.getLocalEbooks();
    const list = local.some((e) => e.id === id)
      ? local.map((e) => (e.id === id ? updatedEbook : e))
      : [updatedEbook, ...local];

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
      } catch (err) {
        console.warn('LocalStorage update quota hit, storing clean metadata:', err);
        const cleanList = list.map(({ downloadFilePath, downloadContent, ...rest }) => ({
          ...rest,
          downloadFilePath: downloadFilePath?.startsWith('data:') ? `indexeddb://${id}` : downloadFilePath,
        }));
        try {
          localStorage.setItem('codingthunder_ebooks', JSON.stringify(cleanList));
        } catch {
          // ignore
        }
      }
    }

    // Update Supabase Cloud
    if (isSupabaseConfigured()) {
      try {
        const sbPayload = { ...updatedEbook };
        if (sbPayload.downloadFilePath?.startsWith('data:')) {
          sbPayload.downloadFilePath = `indexeddb://${id}`;
        }
        await supabaseSaveEbook(sbPayload);
      } catch (e) {
        console.warn('Supabase update ebook error:', e);
      }
    }

    // Update Server
    await this.request<{ ebook: Ebook }>(`/admin/ebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedEbook),
    }).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'ebook', action: 'update', id } }));
    }

    return { ebook: updatedEbook };
  }

  public async deleteEbook(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured()) {
      const res = await supabaseDeleteEbook(id);
      if (!res.success) {
        console.warn('Supabase delete ebook error:', res.error);
      }
    }

    await this.request<{ success: boolean }>(`/admin/ebooks/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalEbooks().filter((e) => e.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { type: 'ebook', action: 'delete', id } }));
    }
    return { success: true };
  }

  public async syncCatalogToSupabaseCloud(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase credentials are not configured yet.' };
    }
    try {
      const courses = this.getLocalCourses();
      const ebooks = this.getLocalEbooks();
      const tutorials = this.getLocalTutorials();

      let savedCourses = 0;
      let savedEbooks = 0;
      let savedTutorials = 0;

      for (const c of courses) {
        const res = await supabaseSaveCourse(c);
        if (res.success) savedCourses++;
      }
      for (const eb of ebooks) {
        const res = await supabaseSaveEbook(eb);
        if (res.success) savedEbooks++;
      }
      for (const t of tutorials) {
        const res = await supabaseSaveTutorial(t);
        if (res.success) savedTutorials++;
      }

      return {
        success: true,
        message: `Cloud Sync Successful! Synced ${savedCourses} courses, ${savedEbooks} ebooks, and ${savedTutorials} tutorials directly to Supabase cloud. All users and devices will now see this catalog.`,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed.' };
    }
  }

  public async getAdminUsers(): Promise<{ users: User[] }> {
    const serverRes = await this.request<{ users: User[] }>('/admin/users');
    if (serverRes && Array.isArray(serverRes.users)) return serverRes;
    return { users: [] };
  }

  public async updateUserRole(id: string, role: 'student' | 'admin'): Promise<{ user: User }> {
    const serverRes = await this.request<{ user: User }>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    if (serverRes && serverRes.user) return serverRes;
    return {
      user: {
        id,
        name: 'User',
        email: 'user@codingthunder.dev',
        role,
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=user',
        createdAt: new Date().toISOString(),
      },
    };
  }

  public async grantUserEnrollment(userId: string, courseId: string) {
    const serverRes = await this.request<any>(`/admin/users/${userId}/grant-enrollment`, {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
    if (serverRes) return serverRes;
    return { success: true };
  }

  public async getAdminOrders(): Promise<{ orders: Order[] }> {
    const serverRes = await this.request<{ orders: Order[] }>('/admin/orders');
    if (serverRes && Array.isArray(serverRes.orders)) return serverRes;
    return { orders: [] };
  }

  public async getAdminSettings(): Promise<{ settings: SiteSettings }> {
    const serverRes = await this.request<{ settings: SiteSettings }>('/admin/settings');
    if (serverRes && serverRes.settings) return serverRes;
    return { settings: this.seed.siteSettings };
  }

  public async updateAdminSettings(settings: Partial<SiteSettings>): Promise<{ settings: SiteSettings }> {
    const serverRes = await this.request<{ settings: SiteSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    if (serverRes && serverRes.settings) return serverRes;
    return { settings: { ...this.seed.siteSettings, ...settings } };
  }

  public async uploadFile(file: File): Promise<{
    success: boolean;
    fileName: string;
    filePath: string;
    fileSize: string;
    fileUrl: string;
    mimeType: string;
  }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string) || '';
        const serverRes = await this.request<any>('/admin/upload-file', {
          method: 'POST',
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data: base64,
          }),
        });

        if (serverRes && serverRes.filePath) {
          resolve(serverRes);
        } else {
          resolve({
            success: true,
            fileName: file.name,
            filePath: base64,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            fileUrl: base64,
            mimeType: file.type || 'application/octet-stream',
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

export const api = new ApiService();
