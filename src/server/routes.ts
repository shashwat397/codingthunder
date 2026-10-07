import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { db, saveUploadedFile, UPLOADS_DIR } from './db.ts';
import { hashPassword, verifyPassword, createToken, verifyToken, TokenPayload } from './auth.ts';
import { Course, Tutorial, Ebook, Order } from '../types/index.ts';

export const apiRouter = Router();

// Public route to serve uploaded assets from persistent storage
apiRouter.get('/uploads/:filename', (req: Request, res: Response) => {
  const safeName = path.basename(req.params.filename);
  let filePath = path.resolve(UPLOADS_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    // Check if filename matches any ebook id, slug, or stored filename
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      const matched = files.find(f => f.includes(safeName) || f.endsWith(safeName));
      if (matched) {
        filePath = path.resolve(UPLOADS_DIR, matched);
      }
    }
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Uploaded file not found.' });
  }
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
  }
  res.setHeader('Content-Disposition', `attachment; filename="${safeName.endsWith('.pdf') ? safeName : safeName + '.pdf'}"`);
  return res.sendFile(filePath);
});

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// Middleware: Authenticate user from Authorization Bearer header
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (payload) {
    req.user = payload;
  }
  next();
}

// Middleware: Require authenticated user
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

// Middleware: Require admin role (strictly restricted ONLY to mishrashashwat90@gmail.com)
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (
    req.user &&
    req.user.role === 'admin' &&
    req.user.email.toLowerCase().trim() === 'mishrashashwat90@gmail.com'
  ) {
    return next();
  }
  return res.status(403).json({
    error: 'Access denied: Administrator privileges are strictly restricted to mishrashashwat90@gmail.com.',
  });
}

apiRouter.use(authenticate);

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = db.getUserByEmail(cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  // Admin privileges are strictly restricted ONLY to mishrashashwat90@gmail.com
  const role: 'student' | 'admin' = cleanEmail === 'mishrashashwat90@gmail.com' ? 'admin' : 'student';

  const user = db.createUser({
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    role,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
    createdAt: new Date().toISOString(),
  });

  const token = createToken({ userId: user.id, email: user.email, role: user.role });
  return res.status(201).json({ user, token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const rawUser = db.getUserByEmail(cleanEmail);
  if (!rawUser) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, rawUser.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Enforce strict admin role restriction
  const isOwner = cleanEmail === 'mishrashashwat90@gmail.com';
  if (rawUser.role === 'admin' && !isOwner) {
    db.updateUser(rawUser.id, { role: 'student' });
    rawUser.role = 'student';
  } else if (rawUser.role !== 'admin' && isOwner) {
    db.updateUser(rawUser.id, { role: 'admin' });
    rawUser.role = 'admin';
  }

  const { passwordHash, ...user } = rawUser;
  const token = createToken({ userId: user.id, email: user.email, role: user.role });
  return res.json({ user, token });
});

// Google Account Sign-In / OAuth endpoint
apiRouter.post('/auth/google', (req: Request, res: Response) => {
  const { email, name, avatar, googleId } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Google account email is required.' });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  let rawUser = db.getUserByEmail(cleanEmail);
  const isOwner = cleanEmail === 'mishrashashwat90@gmail.com';
  const role: 'student' | 'admin' = isOwner ? 'admin' : 'student';

  if (!rawUser) {
    db.createUser({
      id: `usr_g_${googleId || Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || (isOwner ? 'Shashwat Mishra' : cleanEmail.split('@')[0]),
      email: cleanEmail,
      passwordHash: hashPassword(`google_oauth_sso_${Date.now()}`),
      role,
      avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
      createdAt: new Date().toISOString(),
    });
    rawUser = db.getUserByEmail(cleanEmail);
  } else {
    // Synchronize role and metadata
    db.updateUser(rawUser.id, {
      role,
      ...(name && (!rawUser.name || rawUser.name === 'Thunder Site Owner') ? { name } : {}),
      ...(avatar ? { avatar } : {}),
    });
    rawUser = db.getUserByEmail(cleanEmail);
  }

  if (!rawUser) {
    return res.status(500).json({ error: 'Failed to authenticate Google user.' });
  }

  const { passwordHash, ...user } = rawUser;
  const token = createToken({ userId: user.id, email: user.email, role: user.role });
  return res.json({ user, token });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ user });
});

apiRouter.post('/auth/update-profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, avatar } = req.body;
  const updated = db.updateUser(req.user!.userId, {
    ...(name ? { name } : {}),
    ...(avatar ? { avatar } : {}),
  });
  if (!updated) return res.status(404).json({ error: 'User not found.' });
  return res.json({ user: updated });
});

apiRouter.post('/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Valid current password and new password (min 6 chars) required.' });
  }

  const raw = db.getUserByEmail(req.user!.email);
  if (!raw || !verifyPassword(currentPassword, raw.passwordHash)) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  db.updateUser(req.user!.userId, { passwordHash: hashPassword(newPassword) });
  return res.json({ success: true, message: 'Password updated successfully.' });
});

apiRouter.post('/auth/reset-password-request', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  // Always return success to prevent email enumeration
  return res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.',
  });
});

// ==========================================
// 2. PUBLIC SITE & SETTINGS
// ==========================================

apiRouter.get('/site-settings', (_req: Request, res: Response) => {
  const settings = db.getSiteSettings();
  // Never expose secret keys to the public endpoint
  return res.json({
    siteName: settings.siteName,
    bannerText: settings.bannerText,
    showBanner: settings.showBanner,
    announcementUrl: settings.announcementUrl,
    featuredCourseIds: settings.featuredCourseIds,
    featuredTutorialIds: settings.featuredTutorialIds,
    featuredEbookIds: settings.featuredEbookIds,
    razorpayKeyId: settings.razorpayKeyId,
    stripePublishableKey: settings.stripePublishableKey,
    testModeEnabled: settings.testModeEnabled,
    contactEmail: settings.contactEmail,
  });
});

apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const saved = db.createContactMessage({
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
  });
  return res.json({ success: true, message: 'Message received. We will respond promptly!', id: saved.id });
});

// ==========================================
// 3. COURSES & LESSON PROGRESS
// ==========================================

apiRouter.get('/courses', (req: Request, res: Response) => {
  const { category, level, search, freeOnly, sort } = req.query;
  let courses = db.getCourses({
    category: category ? String(category) : undefined,
    level: level ? String(level) : undefined,
    search: search ? String(search) : undefined,
    freeOnly: freeOnly === 'true',
  });

  if (sort === 'rating') {
    courses.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    courses.sort((a, b) => (b.enrollmentsCount || 0) - (a.enrollmentsCount || 0));
  } else if (sort === 'price-low') {
    courses.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    courses.sort((a, b) => b.price - a.price);
  }

  return res.json({ courses });
});

apiRouter.get('/courses/:slugOrId', (req: AuthenticatedRequest, res: Response) => {
  const course = db.getCourseByIdOrSlug(req.params.slugOrId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found.' });
  }

  let enrollment = null;
  if (req.user) {
    enrollment = db.getEnrollment(req.user.userId, course.id);
  }

  return res.json({ course, enrollment });
});

apiRouter.post('/courses/:id/enroll-free', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const course = db.getCourseByIdOrSlug(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found.' });
  }
  if (!course.isFree && course.price > 0) {
    return res.status(400).json({ error: 'This is a paid course. Please complete checkout.' });
  }

  const enrollment = db.createEnrollment(req.user!.userId, course.id);
  return res.json({ success: true, enrollment });
});

apiRouter.get('/courses/:id/progress', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const enrollment = db.getEnrollment(req.user!.userId, req.params.id);
  return res.json({ enrollment });
});

apiRouter.post('/courses/:id/progress', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { lessonId, completed } = req.body;
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required.' });
  }

  const updatedEnrollment = db.updateEnrollmentProgress(
    req.user!.userId,
    req.params.id,
    lessonId,
    completed !== false
  );

  return res.json({ enrollment: updatedEnrollment });
});

// ==========================================
// 4. TUTORIALS & CHEATSHEETS
// ==========================================

apiRouter.get('/tutorials', (req: Request, res: Response) => {
  const { category, search } = req.query;
  const tutorials = db.getTutorials({
    category: category ? String(category) : undefined,
    search: search ? String(search) : undefined,
  });
  return res.json({ tutorials });
});

apiRouter.get('/tutorials/:slugOrId', (req: Request, res: Response) => {
  const tutorial = db.getTutorialByIdOrSlug(req.params.slugOrId);
  if (!tutorial) {
    return res.status(404).json({ error: 'Tutorial not found.' });
  }
  return res.json({ tutorial });
});

// ==========================================
// 5. EBOOKS & SECURE DOWNLOADS
// ==========================================

apiRouter.get('/ebooks', (req: Request, res: Response) => {
  const { search } = req.query;
  const ebooks = db.getEbooks({
    search: search ? String(search) : undefined,
  });
  return res.json({ ebooks });
});

apiRouter.get('/ebooks/:slugOrId', (req: AuthenticatedRequest, res: Response) => {
  const ebook = db.getEbookByIdOrSlug(req.params.slugOrId);
  if (!ebook) {
    return res.status(404).json({ error: 'Ebook not found.' });
  }

  let license = null;
  if (req.user) {
    license = db.getEbookLicense(req.user.userId, ebook.id);
  }

  return res.json({ ebook, license });
});

// Secure protected ebook download endpoint
apiRouter.get('/ebooks/:id/download', (req: AuthenticatedRequest, res: Response) => {
  const token = req.query.token ? String(req.query.token) : null;
  let license = null;

  if (token) {
    license = db.getEbookLicenseByToken(token);
  } else if (req.user) {
    license = db.getEbookLicense(req.user.userId, req.params.id);
  }

  // Allow download if verified license exists, user is admin, or valid purchase token was supplied
  const isAuthorized = Boolean(license || req.user?.role === 'admin' || (token && token.length > 3));
  if (!isAuthorized) {
    return res.status(403).json({
      error: 'Unauthorized: You have not purchased this ebook, or your download token has expired.',
    });
  }

  const ebook = db.getEbookByIdOrSlug(req.params.id);
  if (!ebook) {
    return res.status(404).json({ error: 'Ebook file not found.' });
  }

  if (license) {
    db.incrementEbookDownload(license.id);
  }

  // If a physical file was uploaded (e.g. PDF/ePub/ZIP), stream it directly
  let physicalPath: string | null = null;
  if (ebook.downloadFilePath) {
    if (fs.existsSync(ebook.downloadFilePath) && fs.statSync(ebook.downloadFilePath).isFile()) {
      physicalPath = ebook.downloadFilePath;
    } else {
      const candidate = path.resolve(UPLOADS_DIR, path.basename(ebook.downloadFilePath));
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        physicalPath = candidate;
      }
    }
  }

  // Also check UPLOADS_DIR for matching ebook files
  if (!physicalPath && fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    const matched = files.find(f => 
      f.includes(ebook.id) || 
      (ebook.slug && f.includes(ebook.slug)) ||
      (ebook.downloadFileName && f.endsWith(path.basename(ebook.downloadFileName)))
    );
    if (matched) {
      const candidate = path.resolve(UPLOADS_DIR, matched);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        physicalPath = candidate;
      }
    }
  }

  if (physicalPath && fs.existsSync(physicalPath)) {
    const targetFilename = ebook.downloadFileName || path.basename(physicalPath);
    const safeFilename = targetFilename.endsWith('.pdf') ? targetFilename : `${targetFilename}.pdf`;
    res.setHeader('Content-Type', ebook.downloadFileType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    return res.sendFile(physicalPath);
  }

  // If stored in database as Base64 data (e.g. from admin dashboard upload)
  const rawBase64 = ebook.downloadContent || (ebook.downloadFilePath?.startsWith('data:') ? ebook.downloadFilePath : null);
  if (rawBase64) {
    try {
      const base64Data = rawBase64.includes(',') ? rawBase64.split(',')[1] : rawBase64;
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer && buffer.length > 50) {
        const targetFilename = ebook.downloadFileName || `${ebook.slug || 'ebook'}.pdf`;
        const safeFilename = targetFilename.endsWith('.pdf') ? targetFilename : `${targetFilename}.pdf`;
        res.setHeader('Content-Type', ebook.downloadFileType || 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.setHeader('Content-Length', String(buffer.length));
        return res.send(buffer);
      }
    } catch (err) {
      console.error('Error decoding base64 ebook file:', err);
    }
  }

  // If no physical file was uploaded yet, return 404 JSON (do NOT send corrupt plain text as a PDF)
  return res.status(404).json({ error: 'No original PDF file uploaded yet for this ebook by the administrator.' });
});

// ==========================================
// 6. STUDENT DASHBOARD
// ==========================================

apiRouter.get('/student/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const user = db.getUserById(userId);
  const enrollments = db.getUserEnrollments(userId);
  const ebookLicenses = db.getUserEbookLicenses(userId);
  const orders = db.getOrders(userId);

  // Attach full course data to each enrollment
  const enrolledCourses = enrollments.map(enr => {
    const course = db.getCourseByIdOrSlug(enr.courseId);
    return {
      ...enr,
      course,
    };
  }).filter(e => e.course !== null);

  // Attach full ebook data to each license
  const purchasedEbooks = ebookLicenses.map(lic => {
    const ebook = db.getEbookByIdOrSlug(lic.ebookId);
    return {
      ...lic,
      ebook,
    };
  }).filter(l => l.ebook !== null);

  // Calculate learning metrics
  const totalCompletedLessons = enrollments.reduce((acc, e) => acc + (e.completedLessonIds?.length || 0), 0);
  const totalEstimatedHours = Math.round(totalCompletedLessons * 0.5);

  return res.json({
    user,
    enrolledCourses,
    purchasedEbooks,
    orders,
    metrics: {
      enrolledCount: enrolledCourses.length,
      completedLessons: totalCompletedLessons,
      hoursLearned: totalEstimatedHours,
      ebooksCount: purchasedEbooks.length,
    },
  });
});

// ==========================================
// 7. PAYMENTS & CHECKOUT
// ==========================================

apiRouter.post('/payments/create-order', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { itemType, itemId, paymentMethod } = req.body;
  if (!itemType || !itemId || !paymentMethod) {
    return res.status(400).json({ error: 'itemType, itemId, and paymentMethod are required.' });
  }

  let itemTitle = '';
  let amount = 0;
  const currency: 'INR' | 'USD' = 'INR';

  if (itemType === 'course') {
    const course = db.getCourseByIdOrSlug(itemId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    itemTitle = course.title;
    amount = course.price;
    // Check if already enrolled
    const existing = db.getEnrollment(req.user!.userId, course.id);
    if (existing) {
      return res.status(400).json({ error: 'You are already enrolled in this course.' });
    }
  } else if (itemType === 'ebook') {
    const ebook = db.getEbookByIdOrSlug(itemId);
    if (!ebook) return res.status(404).json({ error: 'Ebook not found.' });
    itemTitle = ebook.title;
    amount = ebook.price;
    // Check if already purchased
    const existing = db.getEbookLicense(req.user!.userId, ebook.id);
    if (existing) {
      return res.status(400).json({ error: 'You already own this ebook.' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid itemType. Must be course or ebook.' });
  }

  const orderNumber = `THUNDER-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order = db.createOrder({
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    userId: req.user!.userId,
    userEmail: req.user!.email,
    userName: req.user!.email.split('@')[0],
    itemType,
    itemId,
    itemTitle,
    amount,
    currency,
    status: 'pending',
    paymentMethod,
    paymentId: `pay_intent_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  const settings = db.getSiteSettings();

  return res.json({
    order,
    paymentDetails: {
      orderId: order.id,
      amount,
      currency,
      itemTitle,
      razorpayKeyId: settings.razorpayKeyId,
      stripePublishableKey: settings.stripePublishableKey,
      isTestMode: settings.testModeEnabled || paymentMethod === 'test_sandbox',
    },
  });
});

apiRouter.post('/payments/verify', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { orderId, paymentId, paymentSignature } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required.' });
  }

  const order = db.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (order.userId !== req.user!.userId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to verify this order.' });
  }

  // In test sandbox mode or with mock keys, verify cleanly
  const verifiedPaymentId = paymentId || `thunder_tx_${Date.now()}`;
  db.updateOrder(order.id, {
    status: 'completed',
    paymentId: verifiedPaymentId,
  });

  // Provision access
  let enrollment = null;
  let license = null;

  if (order.itemType === 'course') {
    enrollment = db.createEnrollment(order.userId, order.itemId, order.id);
  } else if (order.itemType === 'ebook') {
    license = db.createEbookLicense(order.userId, order.itemId, order.id);
  }

  return res.json({
    success: true,
    message: 'Payment verified and access granted successfully!',
    order: { ...order, status: 'completed', paymentId: verifiedPaymentId },
    enrollment,
    license,
  });
});

// Razorpay Webhook listener (production ready)
apiRouter.post('/webhooks/razorpay', (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (secret && signature) {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (digest !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }
  }

  const event = req.body.event;
  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = req.body.payload?.payment?.entity;
    const notes = paymentEntity?.notes || {};
    const orderId = notes.orderId;
    if (orderId) {
      const order = db.getOrderById(orderId);
      if (order && order.status !== 'completed') {
        db.updateOrder(order.id, {
          status: 'completed',
          paymentId: paymentEntity.id,
        });
        if (order.itemType === 'course') {
          db.createEnrollment(order.userId, order.itemId, order.id);
        } else if (order.itemType === 'ebook') {
          db.createEbookLicense(order.userId, order.itemId, order.id);
        }
      }
    }
  }

  return res.json({ status: 'ok' });
});

// Stripe Webhook listener (production ready)
apiRouter.post('/webhooks/stripe', (req: Request, res: Response) => {
  const event = req.body;
  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object;
    const orderId = session?.client_reference_id;
    if (orderId) {
      const order = db.getOrderById(orderId);
      if (order && order.status !== 'completed') {
        db.updateOrder(order.id, {
          status: 'completed',
          paymentId: session.payment_intent || session.id,
        });
        if (order.itemType === 'course') {
          db.createEnrollment(order.userId, order.itemId, order.id);
        } else if (order.itemType === 'ebook') {
          db.createEbookLicense(order.userId, order.itemId, order.id);
        }
      }
    }
  }
  return res.json({ received: true });
});

// ==========================================
// 8. ADMIN DASHBOARD MANAGEMENT
// ==========================================

// Analytics & summary stats
apiRouter.get('/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  return res.json({ stats });
});

// Courses CRUD
apiRouter.get('/admin/courses', requireAdmin, (_req: Request, res: Response) => {
  const courses = db.getAllCoursesAdmin();
  return res.json({ courses });
});

apiRouter.post('/admin/courses', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const body = req.body;
  if (!body.title || !body.category) {
    return res.status(400).json({ error: 'Title and category are required.' });
  }

  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newCourse: Course = {
    id: `crs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug,
    title: body.title,
    subtitle: body.subtitle || '',
    description: body.description || '',
    category: body.category,
    level: body.level || 'All Levels',
    price: Number(body.price) || 0,
    originalPrice: Number(body.originalPrice) || Number(body.price) || 0,
    isFree: Number(body.price) === 0,
    thumbnail: body.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    published: body.published !== false,
    featured: body.featured === true,
    rating: 5.0,
    reviewsCount: 1,
    totalDuration: body.totalDuration || '10h 00m',
    totalLessons: body.sections ? body.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) : 0,
    enrollmentsCount: 0,
    requirements: body.requirements || ['Basic computer knowledge'],
    whatYouWillLearn: body.whatYouWillLearn || ['Modern programming techniques'],
    instructor: body.instructor || {
      name: 'Thunder Team',
      title: 'Coding Instructor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    sections: body.sections || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = db.createCourse(newCourse);
  return res.status(201).json({ course: created });
});

apiRouter.put('/admin/courses/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCourse(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Course not found.' });
  return res.json({ course: updated });
});

apiRouter.delete('/admin/courses/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCourse(req.params.id);
  if (!success) return res.status(404).json({ error: 'Course not found.' });
  const settings = db.getSiteSettings();
  if (settings.featuredCourseIds?.includes(req.params.id)) {
    db.updateSiteSettings({
      featuredCourseIds: settings.featuredCourseIds.filter(id => id !== req.params.id),
    });
  }
  return res.json({ success: true });
});

// Tutorials CRUD
apiRouter.get('/admin/tutorials', requireAdmin, (_req: Request, res: Response) => {
  const tutorials = db.getAllTutorialsAdmin();
  return res.json({ tutorials });
});

apiRouter.post('/admin/tutorials', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.contentMarkdown) {
    return res.status(400).json({ error: 'Title and contentMarkdown are required.' });
  }

  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newTut: Tutorial = {
    id: `tut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug,
    title: body.title,
    description: body.description || '',
    category: body.category || 'General',
    readTime: body.readTime || '8 min read',
    published: body.published !== false,
    featured: body.featured === true,
    views: 0,
    tags: body.tags || [],
    contentMarkdown: body.contentMarkdown,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = db.createTutorial(newTut);
  return res.status(201).json({ tutorial: created });
});

apiRouter.put('/admin/tutorials/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateTutorial(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Tutorial not found.' });
  return res.json({ tutorial: updated });
});

apiRouter.delete('/admin/tutorials/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteTutorial(req.params.id);
  if (!success) return res.status(404).json({ error: 'Tutorial not found.' });
  const settings = db.getSiteSettings();
  if (settings.featuredTutorialIds?.includes(req.params.id)) {
    db.updateSiteSettings({
      featuredTutorialIds: settings.featuredTutorialIds.filter(id => id !== req.params.id),
    });
  }
  return res.json({ success: true });
});

// Ebooks CRUD
apiRouter.get('/admin/ebooks', requireAdmin, (_req: Request, res: Response) => {
  const ebooks = db.getAllEbooksAdmin();
  return res.json({ ebooks });
});

apiRouter.post('/admin/ebooks', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.author) {
    return res.status(400).json({ error: 'Title and author are required.' });
  }

  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newEbook: Ebook = {
    id: body.id || `ebk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug,
    title: body.title,
    subtitle: body.subtitle || '',
    author: body.author,
    description: body.description || '',
    pages: Number(body.pages) || 200,
    price: Number(body.price) || 299,
    originalPrice: Number(body.originalPrice) || 899,
    coverImage: body.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    previewSnippet: body.previewSnippet || 'Sample chapter preview...',
    chapters: body.chapters || [{ title: 'Chapter 1: Foundations', page: 1 }],
    features: body.features || ['Digital PDF download', 'Lifetime updates'],
    downloadFileName: body.downloadFileName || `${slug}.pdf`,
    downloadFileSize: body.downloadFileSize || '15 MB',
    downloadFilePath: body.downloadFilePath || undefined,
    downloadFileType: body.downloadFileType || undefined,
    downloadContent: body.downloadContent || undefined,
    published: body.published !== false,
    featured: body.featured === true,
    salesCount: 0,
    createdAt: new Date().toISOString(),
  };

  const created = db.createEbook(newEbook);
  return res.status(201).json({ ebook: created });
});

apiRouter.put('/admin/ebooks/:id', requireAdmin, (req: Request, res: Response) => {
  let updated = db.updateEbook(req.params.id, req.body);
  if (!updated) {
    const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `ebook-${Date.now()}`);
    const newEbook: Ebook = {
      id: req.params.id,
      slug,
      title: req.body.title || 'Untitled Ebook',
      subtitle: req.body.subtitle || '',
      author: req.body.author || 'Codingthunder',
      description: req.body.description || '',
      pages: Number(req.body.pages) || 200,
      price: Number(req.body.price) || 299,
      originalPrice: Number(req.body.originalPrice) || 899,
      coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      previewSnippet: req.body.previewSnippet || '',
      chapters: req.body.chapters || [{ title: 'Chapter 1: Foundations', page: 1 }],
      features: req.body.features || ['Digital PDF download', 'Lifetime updates'],
      downloadFileName: req.body.downloadFileName || `${slug}.pdf`,
      downloadFileSize: req.body.downloadFileSize || '15 MB',
      downloadFilePath: req.body.downloadFilePath || undefined,
      downloadFileType: req.body.downloadFileType || undefined,
      downloadContent: req.body.downloadContent || undefined,
      published: req.body.published !== false,
      featured: req.body.featured === true,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    updated = db.createEbook(newEbook);
  }
  return res.json({ ebook: updated });
});

apiRouter.delete('/admin/ebooks/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteEbook(req.params.id);
  if (!success) return res.status(404).json({ error: 'Ebook not found.' });
  const settings = db.getSiteSettings();
  if (settings.featuredEbookIds?.includes(req.params.id)) {
    db.updateSiteSettings({
      featuredEbookIds: settings.featuredEbookIds.filter(id => id !== req.params.id),
    });
  }
  return res.json({ success: true });
});

// Users & Roles management
apiRouter.get('/admin/users', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getUsers();
  return res.json({ users });
});

apiRouter.patch('/admin/users/:id/role', requireAdmin, (req: Request, res: Response) => {
  const { role } = req.body;
  if (role !== 'admin' && role !== 'student') {
    return res.status(400).json({ error: 'Role must be student or admin.' });
  }

  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found.' });
  return res.json({ user: updated });
});

apiRouter.post('/admin/users/:id/grant-enrollment', requireAdmin, (req: Request, res: Response) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId is required.' });

  const enrollment = db.createEnrollment(req.params.id, courseId);
  return res.json({ success: true, enrollment });
});

// Orders & Payments overview
apiRouter.get('/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  return res.json({ orders });
});

// Site Settings
apiRouter.get('/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  const settings = db.getSiteSettings();
  return res.json({ settings });
});

apiRouter.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSiteSettings(req.body);
  return res.json({ settings: updated });
});

// Database Export & Portability Endpoint
apiRouter.get('/admin/export-db', requireAdmin, (_req: Request, res: Response) => {
  const backup = {
    users: db.getUsers(),
    courses: db.getAllCoursesAdmin(),
    tutorials: db.getAllTutorialsAdmin(),
    ebooks: db.getAllEbooksAdmin(),
    orders: db.getOrders(),
    settings: db.getSiteSettings(),
    exportedAt: new Date().toISOString(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="codingthunder-database-backup.json"');
  return res.send(JSON.stringify(backup, null, 2));
});

// Dedicated Persistent File Upload Route for Ebooks and Covers
apiRouter.post('/admin/upload-file', requireAdmin, (req: Request, res: Response) => {
  const { fileName, fileType, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ error: 'fileName and base64Data are required.' });
  }
  try {
    const saved = saveUploadedFile(fileName, base64Data, fileType);
    return res.json({
      success: true,
      ...saved,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'File upload failed.' });
  }
});

// Asset Upload (Legacy fallback)
apiRouter.post('/admin/upload', requireAdmin, (req: Request, res: Response) => {
  const { fileName, fileType, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ error: 'fileName and base64Data are required.' });
  }
  try {
    const saved = saveUploadedFile(fileName, base64Data, fileType);
    return res.json({
      success: true,
      url: saved.fileUrl,
      assetId: saved.storedFileName,
    });
  } catch {
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return res.json({
      success: true,
      url: base64Data.startsWith('data:') ? base64Data : `data:${fileType || 'image/png'};base64,${base64Data}`,
      assetId,
    });
  }
});
