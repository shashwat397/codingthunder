import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Course, Tutorial, Ebook, SiteSettings, User, Order, Enrollment, EbookLicense, ContactMessage } from '../types/index.ts';
import { getSeedData } from './seed.ts';
import { hashPassword } from './auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  courses: Course[];
  tutorials: Tutorial[];
  ebooks: Ebook[];
  siteSettings: SiteSettings;
  enrollments: Enrollment[];
  ebookLicenses: EbookLicense[];
  orders: Order[];
  contactMessages: ContactMessage[];
}

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDirs();
    this.data = this.load();
    this.ensureDefaultUsers();
  }

  private ensureDefaultUsers() {
    if (!this.data.users) {
      this.data.users = [];
    }
    const ownerEmail = 'mishrashashwat90@gmail.com';

    let changed = false;
    // Remove any legacy demo accounts
    this.data.users = this.data.users.filter(
      (u) => u.email.toLowerCase() !== 'student@codingthunder.demo' && u.email.toLowerCase() !== 'admin@codingthunder.demo'
    );

    if (!this.data.users.some(u => u.email.toLowerCase() === ownerEmail.toLowerCase())) {
      this.data.users.push({
        id: 'usr_owner_default',
        name: 'Shashwat Mishra',
        email: ownerEmail,
        passwordHash: hashPassword('ThunderDemo!2026'),
        role: 'admin',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(ownerEmail)}`,
        createdAt: new Date().toISOString(),
      });
      changed = true;
    }

    if (changed) {
      this.save();
    }
  }

  private ensureDirs() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DB_FILE)) {
      const seed = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err) {
      console.error('[DB] Error reading database.json, re-seeding:', err);
      const seed = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    // Debounce write slightly to prevent high disk churn
    this.saveTimeout = setTimeout(() => {
      try {
        const tempPath = `${DB_FILE}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
        fs.renameSync(tempPath, DB_FILE);
      } catch (err) {
        console.error('[DB] Failed to save database:', err);
      }
    }, 50);
  }

  // --- Users ---
  public getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  public getUserById(id: string) {
    const found = this.data.users.find(u => u.id === id);
    if (!found) return null;
    const { passwordHash, ...user } = found;
    return user;
  }

  public getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.save();
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public updateUser(id: string, updates: Partial<User & { passwordHash: string }>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    const { passwordHash, ...safeUser } = this.data.users[idx];
    return safeUser;
  }

  // --- Courses ---
  public getCourses(filter?: { category?: string; level?: string; search?: string; freeOnly?: boolean; publishedOnly?: boolean }) {
    let list = [...this.data.courses];
    if (filter?.publishedOnly !== false) {
      list = list.filter(c => c.published);
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(c => c.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.level && filter.level !== 'All') {
      list = list.filter(c => c.level === filter.level);
    }
    if (filter?.freeOnly) {
      list = list.filter(c => c.isFree);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return list;
  }

  public getAllCoursesAdmin() {
    return this.data.courses;
  }

  public getCourseByIdOrSlug(idOrSlug: string) {
    return this.data.courses.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
  }

  public createCourse(course: Course) {
    this.data.courses.unshift(course);
    this.save();
    return course;
  }

  public updateCourse(id: string, updates: Partial<Course>) {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.courses[idx] = { ...this.data.courses[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.courses[idx];
  }

  public deleteCourse(id: string) {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.courses.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Tutorials ---
  public getTutorials(filter?: { category?: string; search?: string; publishedOnly?: boolean }) {
    let list = [...this.data.tutorials];
    if (filter?.publishedOnly !== false) {
      list = list.filter(t => t.published);
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(t => t.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    return list;
  }

  public getAllTutorialsAdmin() {
    return this.data.tutorials;
  }

  public getTutorialByIdOrSlug(idOrSlug: string) {
    const tut = this.data.tutorials.find(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (tut) {
      tut.views = (tut.views || 0) + 1;
      this.save();
    }
    return tut || null;
  }

  public createTutorial(tut: Tutorial) {
    this.data.tutorials.unshift(tut);
    this.save();
    return tut;
  }

  public updateTutorial(id: string, updates: Partial<Tutorial>) {
    const idx = this.data.tutorials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tutorials[idx] = { ...this.data.tutorials[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.tutorials[idx];
  }

  public deleteTutorial(id: string) {
    const idx = this.data.tutorials.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.data.tutorials.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Ebooks ---
  public getEbooks(filter?: { search?: string; publishedOnly?: boolean }) {
    let list = [...this.data.ebooks];
    if (filter?.publishedOnly !== false) {
      list = list.filter(e => e.published);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.author.toLowerCase().includes(q));
    }
    return list;
  }

  public getAllEbooksAdmin() {
    return this.data.ebooks;
  }

  public getEbookByIdOrSlug(idOrSlug: string) {
    return this.data.ebooks.find(e => e.id === idOrSlug || e.slug === idOrSlug) || null;
  }

  public createEbook(ebook: Ebook) {
    this.data.ebooks.unshift(ebook);
    this.save();
    return ebook;
  }

  public updateEbook(id: string, updates: Partial<Ebook>) {
    const idx = this.data.ebooks.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.ebooks[idx] = { ...this.data.ebooks[idx], ...updates };
    this.save();
    return this.data.ebooks[idx];
  }

  public deleteEbook(id: string) {
    const idx = this.data.ebooks.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.ebooks.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Enrollments & Progress ---
  public getUserEnrollments(userId: string) {
    return this.data.enrollments.filter(e => e.userId === userId);
  }

  public getEnrollment(userId: string, courseId: string) {
    return this.data.enrollments.find(e => e.userId === userId && e.courseId === courseId) || null;
  }

  public createEnrollment(userId: string, courseId: string, orderId?: string): Enrollment {
    const existing = this.getEnrollment(userId, courseId);
    if (existing) return existing;

    const course = this.getCourseByIdOrSlug(courseId);
    if (course) {
      course.enrollmentsCount = (course.enrollmentsCount || 0) + 1;
    }

    const newEnr: Enrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progressPercentage: 0,
      completedLessonIds: [],
    };
    this.data.enrollments.push(newEnr);
    this.save();
    return newEnr;
  }

  public updateEnrollmentProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
    let enr = this.getEnrollment(userId, courseId);
    if (!enr) {
      enr = this.createEnrollment(userId, courseId);
    }
    const course = this.getCourseByIdOrSlug(courseId);
    const totalLessons = course ? course.sections.reduce((acc, s) => acc + s.lessons.length, 0) : 1;

    let completedIds = [...(enr.completedLessonIds || [])];
    if (completed && !completedIds.includes(lessonId)) {
      completedIds.push(lessonId);
    } else if (!completed) {
      completedIds = completedIds.filter(id => id !== lessonId);
    }

    const progressPercentage = Math.min(100, Math.round((completedIds.length / Math.max(1, totalLessons)) * 100));

    enr.completedLessonIds = completedIds;
    enr.progressPercentage = progressPercentage;
    enr.lastWatchedLessonId = lessonId;
    enr.lastAccessedAt = new Date().toISOString();

    this.save();
    return enr;
  }

  // --- Ebook Licenses ---
  public getUserEbookLicenses(userId: string) {
    return this.data.ebookLicenses.filter(l => l.userId === userId);
  }

  public getEbookLicense(userId: string, ebookId: string) {
    return this.data.ebookLicenses.find(l => l.userId === userId && l.ebookId === ebookId) || null;
  }

  public getEbookLicenseByToken(token: string) {
    return this.data.ebookLicenses.find(l => l.downloadToken === token) || null;
  }

  public createEbookLicense(userId: string, ebookId: string, orderId: string) {
    const existing = this.getEbookLicense(userId, ebookId);
    if (existing) return existing;

    const ebook = this.getEbookByIdOrSlug(ebookId);
    if (ebook) {
      ebook.salesCount = (ebook.salesCount || 0) + 1;
    }

    const license: EbookLicense = {
      id: `lic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      ebookId,
      purchasedAt: new Date().toISOString(),
      downloadToken: `dl_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`,
      downloadCount: 0,
      orderId,
    };
    this.data.ebookLicenses.push(license);
    this.save();
    return license;
  }

  public incrementEbookDownload(licenseId: string) {
    const lic = this.data.ebookLicenses.find(l => l.id === licenseId);
    if (lic) {
      lic.downloadCount += 1;
      this.save();
    }
  }

  // --- Orders ---
  public getOrders(userId?: string) {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  public getOrderById(orderId: string) {
    return this.data.orders.find(o => o.id === orderId) || null;
  }

  public createOrder(order: Order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  public updateOrder(orderId: string, updates: Partial<Order>) {
    const idx = this.data.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
    this.save();
    return this.data.orders[idx];
  }

  // --- Site Settings ---
  public getSiteSettings(): SiteSettings {
    return this.data.siteSettings;
  }

  public updateSiteSettings(settings: Partial<SiteSettings>) {
    this.data.siteSettings = { ...this.data.siteSettings, ...settings };
    this.save();
    return this.data.siteSettings;
  }

  // --- Contact Messages ---
  public createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      ...msg,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  public getContactMessages() {
    return this.data.contactMessages;
  }

  // --- Analytics Helper ---
  public getAdminStats() {
    const totalStudents = this.data.users.filter(u => u.role === 'student').length;
    const totalCourses = this.data.courses.length;
    const totalEbooks = this.data.ebooks.length;
    const totalTutorials = this.data.tutorials.length;
    const completedOrders = this.data.orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalEnrollments = this.data.enrollments.length;

    return {
      totalStudents,
      totalCourses,
      totalEbooks,
      totalTutorials,
      totalRevenue,
      totalOrders: completedOrders.length,
      totalEnrollments,
      recentOrders: completedOrders.slice(0, 8),
    };
  }
}

export const db = new Database();
export { UPLOADS_DIR };

export function saveUploadedFile(originalName: string, base64Data: string, mimeType?: string) {
  const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `ebk_${Date.now()}_${cleanName}`;
  const filePath = path.resolve(UPLOADS_DIR, uniqueName);

  let buffer: Buffer;
  if (base64Data.includes(',')) {
    const raw = base64Data.split(',')[1];
    buffer = Buffer.from(raw, 'base64');
  } else {
    buffer = Buffer.from(base64Data, 'base64');
  }

  fs.writeFileSync(filePath, buffer);

  const sizeBytes = buffer.length;
  let sizeStr = `${(sizeBytes / 1024).toFixed(1)} KB`;
  if (sizeBytes >= 1024 * 1024) {
    sizeStr = `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return {
    fileName: originalName,
    storedFileName: uniqueName,
    filePath,
    fileUrl: `/api/uploads/${uniqueName}`,
    fileSize: sizeStr,
    sizeBytes,
    mimeType: mimeType || 'application/octet-stream',
  };
}
