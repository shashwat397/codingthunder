import { User, Course, Tutorial, Ebook, Order, Enrollment, SiteSettings, ContactMessage } from '../types/index.ts';

const TOKEN_KEY = 'codingthunder_auth_token';

class ApiService {
  private token: string | null = null;

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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data as T;
  }

  // --- Auth ---
  public async login(email: string, password: string):Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  public async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  public async updateProfile(data: { name?: string; avatar?: string }): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  public logout() {
    this.setToken(null);
  }

  // --- Public & Settings ---
  public async getSiteSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/site-settings');
  }

  public async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.request<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Courses ---
  public async getCourses(params?: { category?: string; level?: string; search?: string; freeOnly?: boolean; sort?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);
    if (params?.freeOnly) query.append('freeOnly', 'true');
    if (params?.sort) query.append('sort', params.sort);

    const qs = query.toString();
    return this.request<{ courses: Course[] }>(`/courses${qs ? `?${qs}` : ''}`);
  }

  public async getCourse(slugOrId: string) {
    return this.request<{ course: Course; enrollment: Enrollment | null }>(`/courses/${slugOrId}`);
  }

  public async enrollFreeCourse(courseId: string) {
    return this.request<{ success: boolean; enrollment: Enrollment }>(`/courses/${courseId}/enroll-free`, {
      method: 'POST',
    });
  }

  public async getCourseProgress(courseId: string) {
    return this.request<{ enrollment: Enrollment | null }>(`/courses/${courseId}/progress`);
  }

  public async updateCourseProgress(courseId: string, lessonId: string, completed = true) {
    return this.request<{ enrollment: Enrollment }>(`/courses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed }),
    });
  }

  // --- Tutorials ---
  public async getTutorials(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return this.request<{ tutorials: Tutorial[] }>(`/tutorials${qs ? `?${qs}` : ''}`);
  }

  public async getTutorial(slugOrId: string) {
    return this.request<{ tutorial: Tutorial }>(`/tutorials/${slugOrId}`);
  }

  // --- Ebooks ---
  public async getEbooks(params?: { search?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return this.request<{ ebooks: Ebook[] }>(`/ebooks${qs ? `?${qs}` : ''}`);
  }

  public async getEbook(slugOrId: string) {
    return this.request<{ ebook: Ebook; license: any | null }>(`/ebooks/${slugOrId}`);
  }

  // --- Student Dashboard ---
  public async getStudentDashboard() {
    return this.request<{
      user: User;
      enrolledCourses: (Enrollment & { course: Course })[];
      purchasedEbooks: (any & { ebook: Ebook })[];
      orders: Order[];
      metrics: {
        enrolledCount: number;
        completedLessons: number;
        hoursLearned: number;
        ebooksCount: number;
      };
    }>('/student/dashboard');
  }

  // --- Payments ---
  public async createPaymentOrder(data: { itemType: 'course' | 'ebook'; itemId: string; paymentMethod: 'razorpay' | 'stripe' | 'test_sandbox' }) {
    return this.request<{
      order: Order;
      paymentDetails: {
        orderId: string;
        amount: number;
        currency: string;
        itemTitle: string;
        razorpayKeyId: string;
        stripePublishableKey: string;
        isTestMode: boolean;
      };
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async verifyPayment(orderId: string, paymentId?: string, paymentSignature?: string) {
    return this.request<{
      success: boolean;
      message: string;
      order: Order;
      enrollment?: Enrollment;
      license?: any;
    }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, paymentSignature }),
    });
  }

  // --- Admin APIs ---
  public async getAdminStats() {
    return this.request<{ stats: any }>('/admin/stats');
  }

  public async getAdminCourses() {
    return this.request<{ courses: Course[] }>('/admin/courses');
  }

  public async createCourse(data: Partial<Course>) {
    return this.request<{ course: Course }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateCourse(id: string, data: Partial<Course>) {
    return this.request<{ course: Course }>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async deleteCourse(id: string) {
    return this.request<{ success: boolean }>(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  public async getAdminTutorials() {
    return this.request<{ tutorials: Tutorial[] }>('/admin/tutorials');
  }

  public async createTutorial(data: Partial<Tutorial>) {
    return this.request<{ tutorial: Tutorial }>('/admin/tutorials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateTutorial(id: string, data: Partial<Tutorial>) {
    return this.request<{ tutorial: Tutorial }>(`/admin/tutorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async deleteTutorial(id: string) {
    return this.request<{ success: boolean }>(`/admin/tutorials/${id}`, {
      method: 'DELETE',
    });
  }

  public async getAdminEbooks() {
    return this.request<{ ebooks: Ebook[] }>('/admin/ebooks');
  }

  public async createEbook(data: Partial<Ebook>) {
    return this.request<{ ebook: Ebook }>('/admin/ebooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateEbook(id: string, data: Partial<Ebook>) {
    return this.request<{ ebook: Ebook }>(`/admin/ebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async deleteEbook(id: string) {
    return this.request<{ success: boolean }>(`/admin/ebooks/${id}`, {
      method: 'DELETE',
    });
  }

  public async getAdminUsers() {
    return this.request<{ users: User[] }>('/admin/users');
  }

  public async updateUserRole(userId: string, role: 'admin' | 'student') {
    return this.request<{ user: User }>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  public async grantUserEnrollment(userId: string, courseId: string) {
    return this.request<{ success: boolean; enrollment: Enrollment }>(`/admin/users/${userId}/grant-enrollment`, {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  public async getAdminOrders() {
    return this.request<{ orders: Order[] }>('/admin/orders');
  }

  public async getAdminSettings() {
    return this.request<{ settings: SiteSettings }>('/admin/settings');
  }

  public async updateAdminSettings(settings: Partial<SiteSettings>) {
    return this.request<{ settings: SiteSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  public async uploadFile(file: File): Promise<{
    success: boolean;
    fileName: string;
    fileUrl: string;
    filePath: string;
    fileSize: string;
    mimeType: string;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await this.request<any>('/admin/upload-file', {
            method: 'POST',
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type || 'application/octet-stream',
              base64Data,
            }),
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file for upload'));
      reader.readAsDataURL(file);
    });
  }
}

export const api = new ApiService();
