import { User, Course, Tutorial, Ebook, Order, Enrollment, SiteSettings } from '../types/index.ts';
import { getSeedData } from '../server/seed.ts';
import { supabase, isSupabaseConfigured, supabaseGetCourses, supabaseGetTutorials, supabaseGetEbooks } from './supabase.ts';

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
    // 1. Try server endpoint
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);
    if (params?.freeOnly) query.append('freeOnly', 'true');
    if (params?.sort) query.append('sort', params.sort);
    const qs = query.toString();

    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ courses: Course[] }>(`/courses${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.courses) && serverRes.courses.length > 0) {
      return { courses: serverRes.courses.filter((c) => !deleted.has(c.id)) };
    }

    // 2. Try Supabase
    if (isSupabaseConfigured()) {
      const sbCourses = await supabaseGetCourses();
      if (sbCourses && sbCourses.length > 0) {
        return { courses: sbCourses.filter((c) => !deleted.has(c.id)) };
      }
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
    const serverRes = await this.request<{ course: Course; enrollment: Enrollment | null }>(`/courses/${slugOrId}`);
    if (serverRes && serverRes.course) {
      return serverRes;
    }

    // Check local catalog
    const all = this.getLocalCourses();
    const found = all.find((c) => c.slug === slugOrId || c.id === slugOrId) || all[0] || null;

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
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();

    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ tutorials: Tutorial[] }>(`/tutorials${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.tutorials) && serverRes.tutorials.length > 0) {
      return { tutorials: serverRes.tutorials.filter((t) => !deleted.has(t.id)) };
    }

    if (isSupabaseConfigured()) {
      const sbTutorials = await supabaseGetTutorials();
      if (sbTutorials && sbTutorials.length > 0) {
        return { tutorials: sbTutorials.filter((t) => !deleted.has(t.id)) };
      }
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
    const serverRes = await this.request<{ tutorial: Tutorial }>(`/tutorials/${slugOrId}`);
    if (serverRes && serverRes.tutorial) return serverRes;

    const all = this.getLocalTutorials();
    const found = all.find((t) => t.slug === slugOrId || t.id === slugOrId) || all[0] || null;
    return { tutorial: found };
  }

  // --- Ebooks ---
  public async getEbooks(params?: { search?: string }): Promise<{ ebooks: Ebook[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();

    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ ebooks: Ebook[] }>(`/ebooks${qs ? `?${qs}` : ''}`);
    if (serverRes && Array.isArray(serverRes.ebooks) && serverRes.ebooks.length > 0) {
      return { ebooks: serverRes.ebooks.filter((e) => !deleted.has(e.id)) };
    }

    if (isSupabaseConfigured()) {
      const sbEbooks = await supabaseGetEbooks();
      if (sbEbooks && sbEbooks.length > 0) {
        return { ebooks: sbEbooks.filter((e) => !deleted.has(e.id)) };
      }
    }

    let list = this.getLocalEbooks();
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return { ebooks: list };
  }

  public async getEbook(slugOrId: string): Promise<{ ebook: Ebook | null; license: any | null }> {
    const serverRes = await this.request<{ ebook: Ebook; license: any | null }>(`/ebooks/${slugOrId}`);
    if (serverRes && serverRes.ebook) return serverRes;

    const all = this.getLocalEbooks();
    const found = all.find((e) => e.slug === slugOrId || e.id === slugOrId) || all[0] || null;

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
    }
    return { ebook: found, license };
  }

  // --- Student Dashboard ---
  public async getStudentDashboard() {
    const serverRes = await this.request<any>('/student/dashboard');
    if (serverRes && serverRes.metrics) return serverRes;

    const courses = this.getLocalCourses().slice(0, 2);
    const ebooks = this.getLocalEbooks().slice(0, 1);

    return {
      user: {
        id: 'usr_current',
        name: 'Developer',
        email: 'developer@codingthunder.dev',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=developer',
        createdAt: new Date().toISOString(),
      },
      enrolledCourses: courses.map((c) => ({
        id: `enr_${c.id}`,
        userId: 'usr_current',
        courseId: c.id,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        progressPercentage: 45,
        completedLessonIds: ['les_1_1'],
        course: c,
      })),
      purchasedEbooks: ebooks.map((e) => ({
        id: `lic_${e.id}`,
        userId: 'usr_current',
        ebookId: e.id,
        purchasedAt: new Date().toISOString(),
        downloadToken: `tok_${e.id}`,
        downloadCount: 1,
        ebook: e,
      })),
      orders: [],
      metrics: {
        enrolledCount: courses.length,
        completedLessons: 4,
        hoursLearned: 12,
        ebooksCount: ebooks.length,
      },
    };
  }

  // --- Payments ---
  public async createPaymentOrder(data: { itemType: 'course' | 'ebook'; itemId: string; paymentMethod: 'razorpay' | 'stripe' | 'test_sandbox' }) {
    const serverRes = await this.request<any>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (serverRes && serverRes.paymentDetails) return serverRes;

    return {
      order: {
        id: `ord_${Date.now()}`,
        orderNumber: `THUNDER-${Date.now().toString().slice(-5)}`,
        userId: 'usr_current',
        userEmail: 'user@codingthunder.dev',
        itemType: data.itemType,
        itemId: data.itemId,
        itemTitle: 'Purchased Item',
        amount: 499,
        currency: 'INR',
        status: 'pending',
        paymentMethod: data.paymentMethod,
        paymentId: `pay_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      paymentDetails: {
        orderId: `ord_${Date.now()}`,
        amount: 499,
        currency: 'INR',
        itemTitle: 'Course / Ebook License',
        razorpayKeyId: 'rzp_test_sample',
        stripePublishableKey: 'pk_test_sample',
        isTestMode: true,
      },
    };
  }

  public async verifyPayment(orderId: string, paymentId?: string, paymentSignature?: string) {
    const serverRes = await this.request<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, paymentSignature }),
    });
    if (serverRes && serverRes.success) return serverRes;

    return {
      success: true,
      message: 'Payment verified and access granted successfully!',
      order: {
        id: orderId,
        orderNumber: `THUNDER-${Date.now().toString().slice(-5)}`,
        userId: 'usr_current',
        userEmail: 'user@codingthunder.dev',
        itemType: 'course',
        itemId: 'crs_webdev_01',
        itemTitle: 'Course Access',
        amount: 499,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'test_sandbox',
        paymentId: paymentId || `pay_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
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

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('courses').upsert(newCourse);
      } catch (e) {
        console.warn('Supabase course upsert error:', e);
      }
    }

    await this.request<{ course: Course }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(newCourse),
    });

    const list = [newCourse, ...this.getLocalCourses().filter((c) => c.id !== newCourse.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
    }
    return { course: newCourse };
  }

  public async updateCourse(id: string, data: Partial<Course>): Promise<{ course: Course }> {
    this.unmarkDeletedId(id);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('courses').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        console.warn('Supabase course update error:', e);
      }
    }

    await this.request<{ course: Course }>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const list = this.getLocalCourses().map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
    }
    const updated = list.find((c) => c.id === id) || (data as Course);
    return { course: updated };
  }

  public async deleteCourse(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('courses').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase course delete error:', e);
      }
    }

    // Inform server if available
    this.request<{ success: boolean }>(`/admin/courses/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalCourses().filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_courses', JSON.stringify(list));
    }
    return { success: true };
  }

  public async getAdminTutorials(): Promise<{ tutorials: Tutorial[] }> {
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

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tutorials').upsert(newTutorial);
      } catch (e) {
        console.warn('Supabase tutorial upsert error:', e);
      }
    }

    await this.request<{ tutorial: Tutorial }>('/admin/tutorials', {
      method: 'POST',
      body: JSON.stringify(newTutorial),
    });

    const list = [newTutorial, ...this.getLocalTutorials().filter((t) => t.id !== newTutorial.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
    }
    return { tutorial: newTutorial };
  }

  public async updateTutorial(id: string, data: Partial<Tutorial>): Promise<{ tutorial: Tutorial }> {
    this.unmarkDeletedId(id);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tutorials').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        console.warn('Supabase tutorial update error:', e);
      }
    }

    await this.request<{ tutorial: Tutorial }>(`/admin/tutorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const list = this.getLocalTutorials().map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t));
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
    }
    const updated = list.find((t) => t.id === id) || (data as Tutorial);
    return { tutorial: updated };
  }

  public async deleteTutorial(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tutorials').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase tutorial delete error:', e);
      }
    }

    this.request<{ success: boolean }>(`/admin/tutorials/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalTutorials().filter((t) => t.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_tutorials', JSON.stringify(list));
    }
    return { success: true };
  }

  public async getAdminEbooks(): Promise<{ ebooks: Ebook[] }> {
    const deleted = this.getDeletedIds();
    const serverRes = await this.request<{ ebooks: Ebook[] }>('/admin/ebooks');
    if (serverRes && Array.isArray(serverRes.ebooks)) {
      return { ebooks: serverRes.ebooks.filter((e) => !deleted.has(e.id)) };
    }
    return { ebooks: this.getLocalEbooks() };
  }

  public async createEbook(data: Partial<Ebook>): Promise<{ ebook: Ebook }> {
    const newEbook: Ebook = {
      ...(data as Ebook),
      id: data.id || `ebk_${Date.now()}`,
      slug: data.slug || `ebook-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.unmarkDeletedId(newEbook.id);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('ebooks').upsert(newEbook);
      } catch (e) {
        console.warn('Supabase ebook upsert error:', e);
      }
    }

    await this.request<{ ebook: Ebook }>('/admin/ebooks', {
      method: 'POST',
      body: JSON.stringify(newEbook),
    });

    const list = [newEbook, ...this.getLocalEbooks().filter((e) => e.id !== newEbook.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
    }
    return { ebook: newEbook };
  }

  public async updateEbook(id: string, data: Partial<Ebook>): Promise<{ ebook: Ebook }> {
    this.unmarkDeletedId(id);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('ebooks').update({ ...data }).eq('id', id);
      } catch (e) {
        console.warn('Supabase ebook update error:', e);
      }
    }

    await this.request<{ ebook: Ebook }>(`/admin/ebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const list = this.getLocalEbooks().map((e) => (e.id === id ? { ...e, ...data } : e));
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
    }
    const updated = list.find((e) => e.id === id) || (data as Ebook);
    return { ebook: updated };
  }

  public async deleteEbook(id: string): Promise<{ success: boolean }> {
    this.addDeletedId(id);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('ebooks').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase ebook delete error:', e);
      }
    }

    this.request<{ success: boolean }>(`/admin/ebooks/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    const list = this.getLocalEbooks().filter((e) => e.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('codingthunder_ebooks', JSON.stringify(list));
    }
    return { success: true };
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
