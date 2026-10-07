import { Course, Tutorial, Ebook, SiteSettings, User, Order, Enrollment, EbookLicense } from '../types/index.ts';

// Precomputed PBKDF2 password hashes for demo users (prevents Node.js crypto module being pulled into browser bundle)
const DEMO_ADMIN_HASH = 'f54e6b69be4fb6ebef5be50af062738e:1fcfb46bb1275c2752d9734e4ce32750ccb976c17337113ca25c3d00c1d10204f0034f8478f9a6e8d62c1e8018be909597f7b20db3bc0ea93f82986660b3311f';
const DEMO_STUDENT_HASH = '9cb9da61770799995b7f255bddd604f1:2989976295e43ecc2c80d0b70c1596efb3157ff92b972316ed7e4302428514c81fcfd7ada813409c1fed4b80217902739fec7354a900eb29ce98f66de04eb6ce';

export function getSeedData() {
  const users: (User & { passwordHash: string })[] = [
    {
      id: 'usr_admin_default',
      name: 'Thunder Admin',
      email: 'admin@codingthunder.demo',
      passwordHash: DEMO_ADMIN_HASH,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=admin',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_student_default',
      name: 'Thunder Student',
      email: 'student@codingthunder.demo',
      passwordHash: DEMO_STUDENT_HASH,
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=student',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_owner_default',
      name: 'Thunder Site Owner',
      email: 'mishrashashwat90@gmail.com',
      passwordHash: DEMO_ADMIN_HASH,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90%40gmail.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  const courses: Course[] = [];

  const tutorials: Tutorial[] = [
    {
      id: 'tut_py_01',
      slug: 'python-3-ultimate-cheatsheet-and-reference',
      title: 'Python 3 Ultimate Cheat Sheet & Syntax Reference',
      description: 'The definitive quick-reference guide for Python programmers. Covers built-in types, comprehensions, regex, file I/O, decorators, and concurrency.',
      category: 'Python',
      readTime: '12 min read',
      published: true,
      featured: true,
      views: 45200,
      tags: ['Python', 'Cheat Sheet', 'Reference', 'Backend'],
      contentMarkdown: `# Python 3 Complete Developer Reference Guide

Welcome to the **Codingthunder Python 3 Reference**. Whether you are preparing for technical interviews or building backend microservices, bookmark this sheet for fast recall.

---

## 1. Built-in Types & Methods

### Strings
Python strings are immutable sequences of Unicode characters.

\`\`\`python
text = "  Codingthunder Python Masterclass  "

# Trimming & Transformations
clean = text.strip()             # "Codingthunder Python Masterclass"
lower = text.lower()             # lowercase
upper = text.upper()             # UPPERCASE
words = clean.split(" ")         # ['Codingthunder', 'Python', 'Masterclass']
joined = " - ".join(words)       # "Codingthunder - Python - Masterclass"

# String Formatting (f-strings)
score = 98.456
print(f"Final Score: {score:.2f}%") # "Final Score: 98.46%"
\`\`\`

---

## 2. Lists, Sets, and Dictionaries

### List Slicing Tricks
\`\`\`python
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

first_three = nums[:3]      # [0, 1, 2]
last_two    = nums[-2:]     # [8, 9]
reverse_arr = nums[::-1]    # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
every_other = nums[::2]     # [0, 2, 4, 6, 8]
\`\`\`

### Comprehensions
\`\`\`python
# Filter even numbers and square them
squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Inverting a Dictionary
user_roles = {"alice": "admin", "bob": "editor", "charlie": "viewer"}
role_to_user = {role: user for user, role in user_roles.items()}
\`\`\`

---

## 3. Custom Decorators
Decorators wrap functions to extend behavior without modifying source code.

\`\`\`python
import time
from functools import wraps

def time_it(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[TIMING] {func.__name__} completed in {duration:.4f}s")
        return result
    return wrapper

@time_it
def compute_heavy_task(n):
    return sum(i * i for i in range(n))

compute_heavy_task(1_000_000)
\`\`\`

---

## 4. File I/O with Context Managers
Always use context managers (\`with\`) to guarantee file descriptors are properly closed:

\`\`\`python
import json

data = {"platform": "Codingthunder", "active_students": 450000}

# Writing JSON
with open("metrics.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

# Reading JSON
with open("metrics.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
    print(loaded["platform"])
\`\`\`
`,
      createdAt: '2026-01-12T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
  ];

  const ebooks: Ebook[] = [];

  const siteSettings: SiteSettings = {
    siteName: 'Codingthunder',
    bannerText: '⚡ Flash Sale: Use code THUNDER2026 for an extra 20% off all masterclasses and ebooks!',
    showBanner: true,
    announcementUrl: '/courses',
    featuredCourseIds: [],
    featuredTutorialIds: ['tut_py_01'],
    featuredEbookIds: [],
    razorpayKeyId: 'rzp_test_sample_key_id',
    stripePublishableKey: 'pk_test_sample_publishable_key',
    testModeEnabled: true,
    contactEmail: 'support@codingthunder.com',
    maintenanceMode: false,
  };

  const enrollments: Enrollment[] = [];
  const ebookLicenses: EbookLicense[] = [];
  const orders: Order[] = [];

  return {
    users,
    courses,
    tutorials,
    ebooks,
    siteSettings,
    enrollments,
    ebookLicenses,
    orders,
    contactMessages: [],
  };
}
