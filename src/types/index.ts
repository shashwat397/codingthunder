export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  enrolledCourseCount?: number;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface LessonResource {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string; // e.g., "14:20"
  videoUrl: string;
  isFreePreview: boolean;
  notesMarkdown?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename: string;
  };
  resources?: LessonResource[];
}

export interface CourseSection {
  id: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  price: number; // in INR (0 for free)
  originalPrice: number;
  isFree: boolean;
  thumbnail: string;
  published: boolean;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  totalDuration: string;
  totalLessons: number;
  enrollmentsCount: number;
  requirements: string[];
  whatYouWillLearn: string[];
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  sections: CourseSection[];
  createdAt: string;
  updatedAt: string;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  published: boolean;
  featured: boolean;
  views: number;
  tags: string[];
  contentMarkdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface EbookChapter {
  title: string;
  page: number;
}

export interface Ebook {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  pages: number;
  price: number;
  originalPrice: number;
  coverImage: string;
  previewSnippet: string;
  chapters: EbookChapter[];
  features: string[];
  downloadFileName: string;
  downloadFileSize: string;
  downloadFilePath?: string;
  downloadFileType?: string;
  downloadContent?: string;
  published: boolean;
  featured: boolean;
  salesCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  itemType: 'course' | 'ebook';
  itemId: string;
  itemTitle: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'razorpay' | 'stripe' | 'test_sandbox';
  paymentId: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  progressPercentage: number;
  completedLessonIds: string[];
  lastWatchedLessonId?: string;
}

export interface EbookLicense {
  id: string;
  userId: string;
  ebookId: string;
  purchasedAt: string;
  downloadToken: string;
  downloadCount: number;
  orderId: string;
}

export interface SiteSettings {
  siteName: string;
  bannerText: string;
  showBanner: boolean;
  announcementUrl: string;
  featuredCourseIds: string[];
  featuredTutorialIds: string[];
  featuredEbookIds: string[];
  razorpayKeyId: string;
  stripePublishableKey: string;
  testModeEnabled: boolean;
  contactEmail: string;
  maintenanceMode: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
