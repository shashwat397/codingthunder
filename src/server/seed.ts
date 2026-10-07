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

  const courses: Course[] = [
    {
      id: 'crs_webdev_01',
      slug: 'full-stack-web-development-mastery',
      title: 'Full-Stack Web Development: Zero to Production',
      subtitle: 'Master modern HTML5, Tailwind CSS, TypeScript, React 19, Node.js, and PostgreSQL with 8 real-world capstone projects.',
      description: 'The most comprehensive, no-fluff web development course crafted for aspiring software engineers. You will learn modern frontend development, backend architecture, database modeling, and automated cloud deployments.',
      category: 'Web Development',
      level: 'All Levels',
      price: 0,
      originalPrice: 4999,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 3820,
      totalDuration: '48h 30m',
      totalLessons: 42,
      enrollmentsCount: 18450,
      requirements: [
        'A computer (Mac, Windows, or Linux) with internet access',
        'Basic familiarity with operating systems and file management',
        'Curiosity to solve real-world coding problems',
      ],
      whatYouWillLearn: [
        'Semantic HTML5, CSS Grid, Flexbox, and Tailwind CSS utility workflows',
        'Modern JavaScript (ES2024+) & TypeScript type safety',
        'React 19 architecture: Hooks, Server Components, and Suspense',
        'Express & Node.js backend RESTful API design',
        'Relational database design, transactions, and migration strategies',
        'Production deployment, security headers, CORS, and performance profiling',
      ],
      instructor: {
        name: 'Vikram "Thunder" Sharma',
        title: 'Lead Software Architect & Educator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      sections: [
        {
          id: 'sec_1',
          title: 'Section 1: Foundations of the Modern Web',
          order: 1,
          lessons: [
            {
              id: 'les_1_1',
              title: 'Welcome to Codingthunder: Curriculum & Dev Environment',
              duration: '14:20',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Standard embed format
              isFreePreview: true,
              notesMarkdown: `# Welcome to Codingthunder!\n\nIn this lesson, we establish our development workspace using VS Code, Node.js 22 LTS, and Git. We configure our editor with essential linting, formatting, and terminal shortcuts.\n\n### Key Tools\n- **VS Code**: Recommended extensions include Prettier, ESLint, and Thunder Client.\n- **Node.js**: Verify version with \`node -v\`.\n- **Git**: Ensure user configuration with \`git config --global user.name "Your Name"\`.`,
              codeSnippet: {
                language: 'bash',
                filename: 'setup.sh',
                code: '# Verify Node & Git installations\nnode -v\nnpm -v\ngit --version\n\n# Clone our starter repository\ngit clone https://github.com/codingthunder/webdev-starter.git\ncd webdev-starter\nnpm install\nnpm run dev',
              },
              resources: [
                {
                  id: 'res_1',
                  name: 'VS-Code-Thunder-Settings.json',
                  size: '4.2 KB',
                  url: '#download',
                },
                {
                  id: 'res_2',
                  name: 'Web-Dev-Roadmap-2026.pdf',
                  size: '1.8 MB',
                  url: '#download',
                },
              ],
            },
            {
              id: 'les_1_2',
              title: 'Modern HTML5 Semantics & Accessible Document Outlines',
              duration: '22:15',
              videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
              isFreePreview: true,
              notesMarkdown: `# HTML5 & Semantic Elements\n\nUsing semantic tags (\`<header>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<footer>\`) provides structure for search engine crawlers and screen readers.\n\n### Key Takeaways:\n1. Never use a \`<div>\` where a \`<button>\` or \`<nav>\` conveys intent.\n2. Always include meaningful \`alt\` tags on descriptive imagery.\n3. Maintain chronological heading levels (\`<h1>\` through \`<h6>\`).`,
              codeSnippet: {
                language: 'html',
                filename: 'index.html',
                code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Codingthunder Semantics</title>\n</head>\n<body>\n  <header role="banner">\n    <nav aria-label="Main Navigation">\n      <a href="/">Home</a>\n      <a href="/courses">Courses</a>\n    </nav>\n  </header>\n  <main id="content">\n    <article>\n      <h1>Building Accessible Interfaces</h1>\n      <p>Semantic web structures empower all learners.</p>\n    </article>\n  </main>\n</body>\n</html>',
              },
              resources: [],
            },
            {
              id: 'les_1_3',
              title: 'CSS Grid & Flexbox: Building Fluid Responsive Layouts',
              duration: '31:40',
              videoUrl: 'https://www.youtube.com/embed/jV8B24rSN5o',
              isFreePreview: false,
              notesMarkdown: `# CSS Grid vs Flexbox\n\n- **Flexbox**: 1-dimensional layout (row OR column). Ideal for navbars, toolbars, and aligned list items.\n- **CSS Grid**: 2-dimensional layout (rows AND columns). Ideal for full-page scaffolding, card matrices, and responsive galleries.`,
              codeSnippet: {
                language: 'css',
                filename: 'layout.css',
                code: '.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));\n  gap: 1.5rem;\n  padding: 2rem;\n}\n\n.card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}',
              },
              resources: [
                {
                  id: 'res_3',
                  name: 'Flexbox-Grid-CheatSheet.pdf',
                  size: '890 KB',
                  url: '#download',
                },
              ],
            },
          ],
        },
        {
          id: 'sec_2',
          title: 'Section 2: React 19 & Component Architecture',
          order: 2,
          lessons: [
            {
              id: 'les_2_1',
              title: 'React 19 State, Effects, and the New Action Hooks',
              duration: '36:10',
              videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
              isFreePreview: false,
              notesMarkdown: `# React 19 State & Actions\n\nReact 19 introduces ergonomic actions, \`useActionState\`, and automated optimistic state transitions with \`useOptimistic\`.`,
              codeSnippet: {
                language: 'tsx',
                filename: 'CourseBookmark.tsx',
                code: 'import React, { useState, useTransition } from "react";\n\nexport function CourseBookmark({ courseId }: { courseId: string }) {\n  const [isBookmarked, setIsBookmarked] = useState(false);\n  const [isPending, startTransition] = useTransition();\n\n  const handleToggle = () => {\n    startTransition(async () => {\n      setIsBookmarked(prev => !prev);\n      await fetch(`/api/courses/${courseId}/bookmark`, { method: "POST" });\n    });\n  };\n\n  return (\n    <button onClick={handleToggle} disabled={isPending}>\n      {isBookmarked ? "★ Saved" : "☆ Save Course"}\n    </button>\n  );\n}',
              },
            },
            {
              id: 'les_2_2',
              title: 'Building a Real-time Dashboard with React Hooks',
              duration: '42:50',
              videoUrl: 'https://www.youtube.com/embed/8JJ101D3KnE',
              isFreePreview: false,
              notesMarkdown: `# Real-time Dashboard Implementation\n\nLearn how to organize custom hooks, manage asynchronous fetching with caching, and handle optimistic updates without external bloat.`,
            },
          ],
        },
        {
          id: 'sec_3',
          title: 'Section 3: Production Backend & Cloud Deployment',
          order: 3,
          lessons: [
            {
              id: 'les_3_1',
              title: 'Express REST APIs, JWT Auth & Rate Limiting',
              duration: '38:00',
              videoUrl: 'https://www.youtube.com/embed/G8uL04ElcVo',
              isFreePreview: false,
              notesMarkdown: `# Express API Security Checklist\n\n1. Use helmet for security headers\n2. Enforce strict rate-limiting on authentication endpoints\n3. Use cryptographically secure token signing with short-lived expiration`,
            },
            {
              id: 'les_3_2',
              title: 'Production Build, CI/CD Pipeline & Dockerization',
              duration: '29:15',
              videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
              isFreePreview: false,
              notesMarkdown: `# Multi-stage Docker Builds\n\nMulti-stage Docker builds reduce image size by over 80% and protect source code from leaking into runtime containers.`,
            },
          ],
        },
      ],
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
    {
      id: 'crs_python_02',
      slug: 'python-mastery-zero-to-hero-automation',
      title: 'Python Mastery: Zero to Hero & Automation',
      subtitle: 'From core syntax and Object-Oriented Design to building web scrapers, FastAPI microservices, and automated desktop bots.',
      description: 'Master Python through practical, production-oriented engineering. Perfect for developers looking to automate workflows, build APIs, or prepare for backend software engineering roles.',
      category: 'Python',
      level: 'Beginner',
      price: 999,
      originalPrice: 2499,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: true,
      rating: 4.95,
      reviewsCount: 2410,
      totalDuration: '34h 15m',
      totalLessons: 36,
      enrollmentsCount: 12890,
      requirements: ['No prior programming experience required', 'A PC or Mac to install Python 3.12+'],
      whatYouWillLearn: [
        'Python 3 fundamentals, data structures, and list comprehensions',
        'Object-Oriented Programming (OOP) with inheritance and dunder methods',
        'Automated web scraping with BeautifulSoup and Playwright',
        'High-speed async APIs with FastAPI and Pydantic validation',
        'Database persistence using SQLAlchemy and SQLite/PostgreSQL',
      ],
      instructor: {
        name: 'Neha Kapoor',
        title: 'Senior Backend Engineer & Python Core Contributor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      sections: [
        {
          id: 'sec_py_1',
          title: 'Section 1: Python Fundamentals & Data Structures',
          order: 1,
          lessons: [
            {
              id: 'les_py_1_1',
              title: 'Python 3.12 Setup & Interactive Shell',
              duration: '18:40',
              videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
              isFreePreview: true,
              notesMarkdown: `# Python 3.12 Fundamentals\n\nVerify your Python installation:\n\`\`\`bash\npython3 --version\n\`\`\`\n\nLearn about dynamic typing, virtual environments with \`venv\`, and code formatting with Ruff.`,
              codeSnippet: {
                language: 'python',
                filename: 'hello.py',
                code: 'def greet(name: str) -> str:\n    return f"Welcome to Codingthunder, {name}!"\n\nif __name__ == "__main__":\n    print(greet("Developer"))',
              },
            },
            {
              id: 'les_py_1_2',
              title: 'Lists, Dictionaries, Sets & Comprehensions',
              duration: '26:50',
              videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
              isFreePreview: true,
              notesMarkdown: `# Data Structures & Comprehensions\n\nComprehensions provide a concise syntax for transforming data.`,
              codeSnippet: {
                language: 'python',
                filename: 'comprehensions.py',
                code: '# List and dictionary comprehensions\nscores = {"Alice": 95, "Bob": 78, "Charlie": 88}\nhonors = {name: score for name, score in scores.items() if score >= 85}\nprint(honors) # {"Alice": 95, "Charlie": 88}',
              },
            },
          ],
        },
      ],
      createdAt: '2026-01-20T00:00:00.000Z',
      updatedAt: '2026-03-02T00:00:00.000Z',
    },
    {
      id: 'crs_dsa_03',
      slug: 'data-structures-and-algorithms-placement-masterclass',
      title: 'Data Structures & Algorithms: The Placement Blueprint',
      subtitle: 'Crack technical interviews at top tier tech firms. 250+ solved problems in C++ and Java with visual intuition.',
      description: 'Master time and space complexity, recursion, two-pointer techniques, sliding windows, binary trees, graphs, and dynamic programming with step-by-step visualizations.',
      category: 'DSA & Algorithms',
      level: 'Intermediate',
      price: 1499,
      originalPrice: 3999,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc13c6b8404?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: true,
      rating: 4.98,
      reviewsCount: 4120,
      totalDuration: '56h 40m',
      totalLessons: 68,
      enrollmentsCount: 15300,
      requirements: ['Basic knowledge of any programming language (C++, Java, Python, or JS)'],
      whatYouWillLearn: [
        'Asymptotic notation: Big-O, Big-Theta, and Big-Omega analysis',
        'Mastering recursion and back-tracking patterns',
        'Trees: Traversals, Lowest Common Ancestor, and Trie implementations',
        'Graph algorithms: BFS, DFS, Dijkstra, Bellman-Ford, and Topo Sort',
        'Dynamic programming: 1D memoization, 2D grid DP, and Knapsack variants',
      ],
      instructor: {
        name: 'Arjun Mehta',
        title: 'Ex-Google Staff Engineer & ICPC Regional Finalist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      sections: [
        {
          id: 'sec_dsa_1',
          title: 'Section 1: Algorithmic Complexity & Arrays',
          order: 1,
          lessons: [
            {
              id: 'les_dsa_1_1',
              title: 'Mastering Big-O Analysis & Space Complexity',
              duration: '28:10',
              videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
              isFreePreview: true,
              notesMarkdown: `# Complexity Analysis\n\nHow to accurately determine time complexity by breaking loops, recursion trees, and master theorem cases.`,
              codeSnippet: {
                language: 'cpp',
                filename: 'two_sum.cpp',
                code: '#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (seen.find(comp) != seen.end()) {\n            return {seen[comp], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}',
              },
            },
          ],
        },
      ],
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:00.000Z',
    },
    {
      id: 'crs_devops_04',
      slug: 'docker-kubernetes-and-cloud-devops',
      title: 'Docker, Kubernetes & Production DevOps Handbook',
      subtitle: 'Build automated CI/CD pipelines, containerize microservices, orchestrate clusters, and monitor with Prometheus & Grafana.',
      description: 'Bridge the gap between writing code and shipping resilient software. A hands-on guide to containerization, Kubernetes manifests, automated testing, and zero-downtime rolling releases.',
      category: 'DevOps & Cloud',
      level: 'Advanced',
      price: 1299,
      originalPrice: 2999,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: false,
      rating: 4.88,
      reviewsCount: 1650,
      totalDuration: '28h 50m',
      totalLessons: 32,
      enrollmentsCount: 8900,
      requirements: ['Basic Linux command line knowledge', 'Familiarity with web application architectures'],
      whatYouWillLearn: [
        'Container internals: Namespaces, cgroups, and layered filesystems',
        'Production Dockerfiles with multi-stage caching',
        'Kubernetes: Pods, Deployments, Services, Ingress, and ConfigMaps',
        'GitHub Actions CI/CD workflows with automated security scanning',
        'Observability: Metrics collection with Prometheus and custom Grafana dashboards',
      ],
      instructor: {
        name: 'Sarah Chen',
        title: 'Principal SRE & Cloud Architect',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      },
      sections: [
        {
          id: 'sec_dev_1',
          title: 'Section 1: Docker Internals & Efficient Images',
          order: 1,
          lessons: [
            {
              id: 'les_dev_1_1',
              title: 'Containerization vs Virtualization: The Mental Model',
              duration: '20:15',
              videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
              isFreePreview: true,
              notesMarkdown: `# Containers Under the Hood\n\nContainers are isolated user-space processes running directly on the host kernel using namespaces and cgroups.`,
              codeSnippet: {
                language: 'dockerfile',
                filename: 'Dockerfile',
                code: '# Multi-stage build example\nFROM node:22-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD ["node", "dist/server.js"]',
              },
            },
          ],
        },
      ],
      createdAt: '2026-02-10T00:00:00.000Z',
      updatedAt: '2026-03-08T00:00:00.000Z',
    },
    {
      id: 'crs_nextjs_05',
      slug: 'nextjs-15-fullstack-architecture',
      title: 'Next.js 15: Full-Stack App Router Architecture',
      subtitle: 'Build lightning-fast SaaS apps with React Server Components, Server Actions, edge caching, and Auth.js v5.',
      description: 'Master the definitive React framework. Learn how to architect enterprise Next.js applications with optimal bundle sizes, parallel routing, and edge middleware.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 0,
      originalPrice: 1999,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: false,
      rating: 4.92,
      reviewsCount: 1980,
      totalDuration: '22h 30m',
      totalLessons: 28,
      enrollmentsCount: 14200,
      requirements: ['Solid knowledge of React and JavaScript (ES6+)'],
      whatYouWillLearn: [
        'App Router architecture: layouts, templates, and error boundaries',
        'Server Components vs Client Components data flow',
        'Mutation handling using Server Actions with form validation',
        'Edge middleware for geolocation routing and auth redirects',
      ],
      instructor: {
        name: 'Vikram "Thunder" Sharma',
        title: 'Lead Software Architect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      sections: [
        {
          id: 'sec_nxt_1',
          title: 'Section 1: Next.js 15 Foundations',
          order: 1,
          lessons: [
            {
              id: 'les_nxt_1_1',
              title: 'Server Components Deep Dive & Hydration',
              duration: '24:00',
              videoUrl: 'https://www.youtube.com/embed/Sklc_poChn4',
              isFreePreview: true,
              notesMarkdown: `# Next.js 15 RSC Paradigm\n\nServer Components render on the server without shipping React runtime JavaScript to the client.`,
            },
          ],
        },
      ],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-03-10T00:00:00.000Z',
    },
  ];

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
    {
      id: 'tut_react_02',
      slug: 'react-19-hooks-and-server-components-guide',
      title: 'React 19 Complete Guide: Hooks, Server Components & Suspense',
      description: 'Everything you need to know about React 19: useActionState, useOptimistic, the React Compiler, and zero-client-bundle paradigms.',
      category: 'React',
      readTime: '15 min read',
      published: true,
      featured: true,
      views: 38900,
      tags: ['React', 'Frontend', 'TypeScript', 'WebDev'],
      contentMarkdown: `# React 19 Complete Architecture Guide

React 19 represents the most significant evolution in React's component model since Hooks arrived in React 16.8.

---

## What Changed in React 19?

1. **The React Compiler (Forget \`useMemo\` and \`useCallback\`)**: React now automatically optimizes re-renders at build time.
2. **Actions & Form State**: Built-in support for async mutations and optimistic states.
3. **\`useActionState\`**: Replaces boilerplate \`useState\` + async try/catch blocks.

---

## 1. Using \`useActionState\`

\`\`\`tsx
import { useActionState } from 'react';

async function updateProfile(previousState: any, formData: FormData) {
  const name = formData.get('name') as string;
  try {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Update failed');
    return { success: true, name, error: null };
  } catch (err: any) {
    return { success: false, name: previousState.name, error: err.message };
  }
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    name: 'Thunder Student',
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      <input name="name" defaultValue={state.name} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </button>
      {state.error && <p className="text-red-400">{state.error}</p>}
    </form>
  );
}
\`\`\`

---

## 2. Instant Feedback with \`useOptimistic\`

\`\`\`tsx
import { useOptimistic, useState } from 'react';

export function LessonUpvote({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [optimisticCount, setOptimisticCount] = useOptimistic(
    count,
    (current, update: number) => current + update
  );

  const handleUpvote = async () => {
    setOptimisticCount(1); // Instantly updates UI
    await fetch('/api/lessons/upvote', { method: 'POST' });
    setCount(prev => prev + 1);
  };

  return (
    <button onClick={handleUpvote} className="hover:text-amber-400">
      ⚡ {optimisticCount} Upvotes
    </button>
  );
}
\`\`\`
`,
      createdAt: '2026-01-18T00:00:00.000Z',
      updatedAt: '2026-03-04T00:00:00.000Z',
    },
    {
      id: 'tut_git_03',
      slug: 'git-and-github-pro-workflow-guide',
      title: 'Git & GitHub Pro Workflow: Rebasing, Cherry-Picking & Clean Commits',
      description: 'Master real-world Git workflows used in top engineering teams. Learn interactive rebase, squashing, merge conflict resolution, and bisect.',
      category: 'Tools & DevOps',
      readTime: '9 min read',
      published: true,
      featured: false,
      views: 29400,
      tags: ['Git', 'DevOps', 'GitHub', 'Workflow'],
      contentMarkdown: `# Professional Git & GitHub Guide

Clean commit histories make debugging and code audits painless. Here is the modern engineer's battle-tested cheat sheet.

---

## 1. Interactive Rebasing

Never push messy "fixed typo" or "trying again" commits to shared pull requests. Clean them up locally before pushing:

\`\`\`bash
# Interactively rebase the last 3 commits
git rebase -i HEAD~3
\`\`\`

You will see an editor buffer:
\`\`\`text
pick 4a9f1c2 Add user authentication endpoint
squash 8b3e9a1 Fix linting error in auth controller
squash c71d2e4 Update auth test assertions
\`\`\`

Save and close to merge the 3 commits into one clean, well-described atomic unit.

---

## 2. Finding Bugs with \`git bisect\`
When a bug crept in somewhere over the last 100 commits, use binary search:

\`\`\`bash
git bisect start
git bisect bad                 # Current commit is broken
git bisect good v1.4.0         # v1.4.0 was working
# Git checks out midpoint; run your test script:
npm test
# Tell git:
git bisect good (or git bisect bad)
# Git isolates the exact culprit commit in ~7 steps!
git bisect reset
\`\`\`
`,
      createdAt: '2026-01-25T00:00:00.000Z',
      updatedAt: '2026-02-28T00:00:00.000Z',
    },
    {
      id: 'tut_js_04',
      slug: 'modern-javascript-es2024-features-guide',
      title: 'Modern JavaScript (ES2024–2026) Features You Must Know',
      description: 'Deep dive into Promise.withResolvers, Object.groupBy, Array findLast, Temporal API, and Top-level Await.',
      category: 'JavaScript',
      readTime: '10 min read',
      published: true,
      featured: true,
      views: 31800,
      tags: ['JavaScript', 'WebDev', 'ESNext'],
      contentMarkdown: `# Modern JavaScript (ES2024–2026)

JavaScript evolves every year. Here are the most impactful native features you should adopt in production code today.

---

## 1. Object.groupBy()
Grouping data arrays by key no longer requires \`reduce\` boilerplate:

\`\`\`javascript
const courses = [
  { title: "React 19", category: "Frontend" },
  { title: "Express REST", category: "Backend" },
  { title: "Tailwind 4", category: "Frontend" },
  { title: "PostgreSQL", category: "Backend" },
];

const grouped = Object.groupBy(courses, (course) => course.category);
/*
{
  Frontend: [{ title: "React 19", ... }, { title: "Tailwind 4", ... }],
  Backend:  [{ title: "Express REST", ... }, { title: "PostgreSQL", ... }]
}
*/
\`\`\`

---

## 2. Promise.withResolvers()
Extracts resolve and reject callbacks cleanly for event-driven flows:

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers();

// Listen to an external socket event
socket.on("connected", () => resolve("Connected successfully!"));
socket.on("error", (err) => reject(err));

await promise;
\`\`\`
`,
      createdAt: '2026-02-05T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
  ];

  const ebooks: Ebook[] = [
    {
      id: 'ebk_fullstack_01',
      slug: 'fullstack-developer-playbook-2026',
      title: "The Full-Stack Developer's Playbook (2026 Edition)",
      subtitle: 'System Architecture, Database Scaling, Microservices & Real-World Best Practices.',
      author: 'Vikram "Thunder" Sharma & Team',
      description: 'A 380-page comprehensive manual for engineers building production-grade web platforms. Includes complete architectural blueprints, caching layers, high-throughput database schemas, and real disaster recovery incident reports.',
      pages: 384,
      price: 499,
      originalPrice: 1499,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      previewSnippet: `### Chapter 1: The Anatomy of a High-Throughput Web Application\n\nWhen request traffic spikes from 1,000 queries per minute to 100,000, un-indexed queries and unbuffered connection pools will immediately bring your database to a halt.\n\nIn this chapter, we dissect the five foundational pillars of web performance:\n1. Zero-roundtrip caching with Redis clusters\n2. Optimistic locking and database isolation levels\n3. Reverse-proxy load balancing and SSL termination\n4. Asynchronous message queuing with BullMQ / RabbitMQ\n5. Graceful degradation and circuit breakers`,
      chapters: [
        { title: '1. Anatomy of High-Throughput Systems', page: 12 },
        { title: '2. Modern Database Modeling & Indexing', page: 48 },
        { title: '3. Authentication: JWT, Sessions & WebAuthn', page: 94 },
        { title: '4. API Design: REST vs GraphQL vs tRPC', page: 142 },
        { title: '5. Caching Strategies: Redis & Edge CDNs', page: 204 },
        { title: '6. Docker, Kubernetes & Zero-Downtime Releases', page: 268 },
        { title: '7. Monitoring, Sentry & Incident Postmortems', page: 330 },
      ],
      features: [
        'Complete 384-page high-resolution PDF + ePub formats',
        'Includes 14 downloadable GitHub starter boilerplates',
        'Access to private Codingthunder Discord architect channel',
        'Lifetime free updates for all upcoming editions',
      ],
      downloadFileName: 'FullStack-Developers-Playbook-2026-Codingthunder.pdf',
      downloadFileSize: '24.8 MB',
      downloadContent: 'CODINGTHUNDER_EBOOK_PACKAGE: FULL_STACK_PLAYBOOK_2026_EDITION. Thank you for purchasing! This is your verified authorized digital copy with complete schematics, source code repositories, and cheat sheets.',
      published: true,
      featured: true,
      salesCount: 3420,
      createdAt: '2026-01-05T00:00:00.000Z',
    },
    {
      id: 'ebk_dsa_02',
      slug: 'crack-the-coding-interview-150-core-patterns',
      title: 'Crack the Coding Interview: 150 Core Patterns',
      subtitle: 'The Visual Mental Models Needed to Ace FAANG & High-Growth Startup DSA Rounds.',
      author: 'Arjun Mehta (Ex-Google Staff Engineer)',
      description: 'Stop grinding hundreds of random LeetCode questions blindly. Master the 14 fundamental algorithmic patterns that solve 90% of all technical coding interview challenges.',
      pages: 290,
      price: 399,
      originalPrice: 1199,
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80',
      previewSnippet: `### Pattern 1: The Two Pointers Technique\n\nWhenever a problem asks for finding pairs or reversing elements in a sorted array, two pointers reduce time complexity from O(N²) to O(N).\n\nKey Scenarios:\n- Squaring a sorted array\n- Dutch National Flag problem (0s, 1s, and 2s sorting)\n- Subarray with target sum`,
      chapters: [
        { title: '1. The Two-Pointer Technique', page: 14 },
        { title: '2. Sliding Window Mastery', page: 42 },
        { title: '3. Fast & Slow Pointers (Cycle Detection)', page: 70 },
        { title: '4. Merge Intervals & Range Overlaps', page: 98 },
        { title: '5. In-Place Reversal of a Linked List', page: 122 },
        { title: '6. Tree BFS & DFS Traversal Patterns', page: 156 },
        { title: '7. Topological Sort & Graph Cycles', page: 210 },
        { title: '8. 0/1 Knapsack & Dynamic Programming Patterns', page: 248 },
      ],
      features: [
        '290 pages of step-by-step diagrammatic proofs',
        'Solutions provided in C++, Python, and JavaScript',
        'Printable 1-page visual flashcards for fast recall',
      ],
      downloadFileName: 'Crack-DSA-150-Patterns-Codingthunder.pdf',
      downloadFileSize: '18.4 MB',
      downloadContent: 'CODINGTHUNDER_EBOOK_PACKAGE: CRACK_THE_CODING_INTERVIEW_150_PATTERNS. Thank you for purchasing! Your official digital copy includes flashcards and complete test cases.',
      published: true,
      featured: true,
      salesCount: 4890,
      createdAt: '2026-01-15T00:00:00.000Z',
    },
    {
      id: 'ebk_typescript_03',
      slug: 'clean-code-in-typescript-production-guide',
      title: 'Clean Code in TypeScript: Real-World Architecture',
      subtitle: 'Eliminate "any", design ergonomic generics, and build maintainable codebases.',
      author: 'Sarah Chen & Vikram Sharma',
      description: 'Take your TypeScript skills from surface-level annotations to type gymnastics, branded types, and domain-driven design that catches bugs before runtime.',
      pages: 220,
      price: 299,
      originalPrice: 899,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      previewSnippet: `### Chapter 2: Branded Types & Runtime Safety\n\nPrimitive obsession is one of the leading causes of production bugs. Passing an unvalidated string where a UserId was expected can cause catastrophic privilege escalation.\n\nBranded types enable compile-time separation of primitives with zero runtime overhead.`,
      chapters: [
        { title: '1. Beyond Basics: Discriminated Unions', page: 10 },
        { title: '2. Branded Types & Value Objects', page: 38 },
        { title: '3. Conditional Types & Infer Keyword', page: 72 },
        { title: '4. Designing Robust Generic Libraries', page: 110 },
        { title: '5. Zod Schema Validation & Type Inferences', page: 150 },
        { title: '6. Error Handling Without Throwing Exceptions', page: 184 },
      ],
      features: [
        '220 pages with real-world refactoring case studies',
        'Ready-to-use utility types snippet library',
      ],
      downloadFileName: 'Clean-Code-TypeScript-Codingthunder.pdf',
      downloadFileSize: '14.1 MB',
      downloadContent: 'CODINGTHUNDER_EBOOK_PACKAGE: CLEAN_CODE_IN_TYPESCRIPT. Official licensed copy.',
      published: true,
      featured: false,
      salesCount: 2150,
      createdAt: '2026-02-01T00:00:00.000Z',
    },
  ];

  const siteSettings: SiteSettings = {
    siteName: 'Codingthunder',
    bannerText: '⚡ Flash Sale: Use code THUNDER2026 for an extra 20% off all masterclasses and ebooks!',
    showBanner: true,
    announcementUrl: '/courses',
    featuredCourseIds: ['crs_webdev_01', 'crs_python_02', 'crs_dsa_03'],
    featuredTutorialIds: ['tut_py_01', 'tut_react_02', 'tut_js_04'],
    featuredEbookIds: ['ebk_fullstack_01', 'ebk_dsa_02'],
    razorpayKeyId: 'rzp_test_sample_key_id',
    stripePublishableKey: 'pk_test_sample_publishable_key',
    testModeEnabled: true,
    contactEmail: 'support@codingthunder.com',
    maintenanceMode: false,
  };

  // Seed sample enrollments for the student user
  const enrollments: Enrollment[] = [
    {
      id: 'enr_01',
      userId: 'usr_student_01',
      courseId: 'crs_webdev_01',
      enrolledAt: '2026-01-20T10:00:00.000Z',
      lastAccessedAt: '2026-03-09T14:30:00.000Z',
      progressPercentage: 45,
      completedLessonIds: ['les_1_1', 'les_1_2'],
      lastWatchedLessonId: 'les_1_3',
    },
    {
      id: 'enr_02',
      userId: 'usr_student_01',
      courseId: 'crs_nextjs_05',
      enrolledAt: '2026-02-16T12:00:00.000Z',
      lastAccessedAt: '2026-03-08T09:15:00.000Z',
      progressPercentage: 10,
      completedLessonIds: ['les_nxt_1_1'],
      lastWatchedLessonId: 'les_nxt_1_1',
    },
  ];

  // Seed sample ebook license for student
  const ebookLicenses: EbookLicense[] = [
    {
      id: 'lic_01',
      userId: 'usr_student_01',
      ebookId: 'ebk_fullstack_01',
      purchasedAt: '2026-01-22T16:20:00.000Z',
      downloadToken: 'dl_tok_sample_student_01',
      downloadCount: 2,
      orderId: 'ord_demo_01',
    },
  ];

  // Seed sample orders
  const orders: Order[] = [
    {
      id: 'ord_demo_01',
      orderNumber: 'THUNDER-2026-00842',
      userId: 'usr_student_01',
      userEmail: 'student@codingthunder.demo',
      userName: 'Alex Rivera',
      itemType: 'ebook',
      itemId: 'ebk_fullstack_01',
      itemTitle: "The Full-Stack Developer's Playbook (2026 Edition)",
      amount: 499,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'test_sandbox',
      paymentId: 'th_test_pay_99841',
      createdAt: '2026-01-22T16:20:00.000Z',
    },
    {
      id: 'ord_demo_02',
      orderNumber: 'THUNDER-2026-00915',
      userId: 'usr_student_01',
      userEmail: 'student@codingthunder.demo',
      userName: 'Alex Rivera',
      itemType: 'course',
      itemId: 'crs_webdev_01',
      itemTitle: 'Full-Stack Web Development: Zero to Production',
      amount: 0,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'test_sandbox',
      paymentId: 'th_free_enroll_001',
      createdAt: '2026-01-20T10:00:00.000Z',
    },
  ];

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
