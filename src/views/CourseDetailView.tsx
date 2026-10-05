import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, Star, Users, Download, ArrowLeft, Lock, FileText, ChevronDown, ChevronUp, Share2, BookOpen, Sparkles, Check, Code } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, CourseLesson, Enrollment } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { CodeBlock } from '../components/common/CodeBlock.tsx';

interface CourseDetailViewProps {
  courseSlugOrId: string;
  onNavigate: (path: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ courseSlugOrId, onNavigate }) => {
  const { user, openAuthModal, openCheckout } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'resources'>('notes');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [playerMode, setPlayerMode] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await api.getCourse(courseSlugOrId);
        setCourse(res.course);
        setEnrollment(res.enrollment);

        // Expand first section by default
        if (res.course.sections.length > 0) {
          setExpandedSections({ [res.course.sections[0].id]: true });
          const firstLesson = res.course.sections[0].lessons[0];
          setCurrentLesson(firstLesson || null);
        }

        // If enrolled, auto-open player mode
        if (res.enrollment) {
          setPlayerMode(true);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseSlugOrId, user]);

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    if (!enrollment && !lesson.isFreePreview) {
      if (!user) {
        openAuthModal('login');
      } else {
        openCheckout({
          itemType: 'course',
          itemId: course!.id,
          itemTitle: course!.title,
          price: course!.price,
        });
      }
      return;
    }
    setCurrentLesson(lesson);
    setPlayerMode(true);
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!course || !enrollment) return;
    const isCompleted = enrollment.completedLessonIds.includes(lessonId);
    try {
      const res = await api.updateCourseProgress(course.id, lessonId, !isCompleted);
      setEnrollment(res.enrollment);
      if (!isCompleted && res.enrollment.progressPercentage === 100) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleEnrollFree = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!course) return;

    setIsEnrolling(true);
    try {
      const res = await api.enrollFreeCourse(course.id);
      setEnrollment(res.enrollment);
      setPlayerMode(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(err.message || 'Enrollment failed.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/3 mx-auto mb-4" />
        <div className="h-64 bg-slate-900 rounded-2xl max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-slate-400 text-sm mb-4">The requested course could not be located.</p>
        <button
          onClick={() => onNavigate('/courses')}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-800 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onNavigate('/courses')}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400">{course.category}</span>
            <span>·</span>
            <span>{course.level}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {playerMode && currentLesson ? (
          /* ==================================================== */
          /* 1. LMS COURSE PLAYER VIEW */
          /* ==================================================== */
          <div className="space-y-6 animate-fadeIn">
            {/* Player Topbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>{currentLesson.title}</span>
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Course: {course.title}
                </div>
              </div>

              {isEnrolled && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Overall Progress</div>
                    <div className="text-sm font-bold text-amber-400 font-mono">
                      {enrollment.progressPercentage}% Completed
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video Player + Lesson Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player Column */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {currentLesson.videoUrl.includes('youtube') ? (
                    <iframe
                      src={`${currentLesson.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                      title={currentLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                      <Play className="w-16 h-16 text-amber-400 mb-3 fill-current opacity-80" />
                      <p className="text-sm text-slate-300 font-semibold">{currentLesson.title}</p>
                      <p className="text-xs text-slate-500 mt-1">High-definition stream ready ({currentLesson.duration})</p>
                    </div>
                  )}
                </div>

                {/* Player Controls & Action bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {currentLesson.duration}
                    </span>
                    {currentLesson.isFreePreview && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        Free Preview
                      </span>
                    )}
                  </div>

                  {isEnrolled && (
                    <button
                      onClick={() => handleToggleLessonComplete(currentLesson.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        enrollment.completedLessonIds.includes(currentLesson.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>
                        {enrollment.completedLessonIds.includes(currentLesson.id)
                          ? 'Lesson Completed (Toggle)'
                          : 'Mark as Completed'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Tabs below Player: Notes / Code / Downloads */}
                <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === 'notes'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Lesson Notes</span>
                    </button>
                    {currentLesson.codeSnippet && (
                      <button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'code'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code className="w-4 h-4" />
                        <span>Source Code</span>
                      </button>
                    )}
                    {currentLesson.resources && currentLesson.resources.length > 0 && (
                      <button
                        onClick={() => setActiveTab('resources')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'resources'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        <span>Downloadable Files ({currentLesson.resources.length})</span>
                      </button>
                    )}
                  </div>

                  {activeTab === 'notes' && (
                    <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-3 font-sans">
                      {currentLesson.notesMarkdown ? (
                        <div className="whitespace-pre-wrap">{currentLesson.notesMarkdown}</div>
                      ) : (
                        <p className="text-slate-500 italic">No notes provided for this lesson.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'code' && currentLesson.codeSnippet && (
                    <div>
                      <CodeBlock
                        code={currentLesson.codeSnippet.code}
                        language={currentLesson.codeSnippet.language}
                        filename={currentLesson.codeSnippet.filename}
                      />
                    </div>
                  )}

                  {activeTab === 'resources' && currentLesson.resources && (
                    <div className="space-y-2">
                      {currentLesson.resources.map((res) => (
                        <div
                          key={res.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-400" />
                            <span className="font-mono text-white">{res.name}</span>
                            <span className="text-slate-500">({res.size})</span>
                          </div>
                          <a
                            href={res.url}
                            download={res.name}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Curriculum Checklist */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#0c101c] border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-1">Course Curriculum</h3>
                  <p className="text-xs text-slate-400">
                    {course.sections.length} Sections · {course.totalLessons} Lessons
                  </p>
                </div>

                <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                  {course.sections.map((section) => {
                    const isExpanded = !!expandedSections[section.id];
                    return (
                      <div
                        key={section.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <span>{section.title}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-800/80 divide-y divide-slate-800/40">
                            {section.lessons.map((lesson) => {
                              const isSelected = currentLesson.id === lesson.id;
                              const isDone = enrollment?.completedLessonIds.includes(lesson.id);
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson)}
                                  className={`w-full p-3 flex items-start gap-2.5 text-left transition-colors cursor-pointer text-xs ${
                                    isSelected
                                      ? 'bg-amber-500/15 text-amber-300 font-semibold'
                                      : 'hover:bg-slate-800/40 text-slate-300'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {isDone ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Play className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400 fill-current' : 'text-slate-500'}`} />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="line-clamp-1">{lesson.title}</div>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                                      <span>{lesson.duration}</span>
                                      {lesson.isFreePreview && !isEnrolled && (
                                        <span className="text-emerald-400">· Free Preview</span>
                                      )}
                                      {!lesson.isFreePreview && !isEnrolled && (
                                        <span className="text-slate-500 flex items-center gap-0.5">
                                          <Lock className="w-3 h-3" /> Locked
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* 2. PUBLIC COURSE OVERVIEW & SALES VIEW */
          /* ==================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Overview, Curriculum, What You'll Learn */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Box */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {course.rating} ({course.reviewsCount} reviews)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.enrollmentsCount?.toLocaleString()} students
                  </span>
                  <span>·</span>
                  <span>{course.level}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-base text-slate-300 leading-relaxed">{course.subtitle}</p>

                {/* Instructor chip */}
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-xs text-slate-400">Created by</div>
                    <div className="text-sm font-bold text-white">{course.instructor.name}</div>
                  </div>
                </div>
              </div>

              {/* What You Will Learn Card */}
              <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>What You Will Learn</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Curriculum Accordion */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Course Curriculum</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {course.sections.length} Sections · {course.totalLessons} Lessons · {course.totalDuration}
                  </div>
                </div>

                <div className="space-y-3">
                  {course.sections.map((section) => {
                    const isExpanded = !!expandedSections[section.id];
                    return (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-slate-800 bg-[#0c101c] overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-mono text-xs">Section {section.order}</span>
                            <span>{section.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                            <span>{section.lessons.length} lessons</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-800 divide-y divide-slate-800/40">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="w-3.5 h-3.5 text-slate-500 fill-current" />
                                  <span className="text-slate-200">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-slate-500">{lesson.duration}</span>
                                  {lesson.isFreePreview ? (
                                    <button
                                      onClick={() => handleSelectLesson(lesson)}
                                      className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-[11px] cursor-pointer"
                                    >
                                      Preview
                                    </button>
                                  ) : (
                                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements & Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Course Requirements</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Sticky Enrollment Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl space-y-6">
                {/* Thumbnail Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      if (course.sections[0]?.lessons[0]) {
                        handleSelectLesson(course.sections[0].lessons[0]);
                      }
                    }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white hover:bg-slate-950/40 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <span className="text-xs font-bold font-mono">Watch Free Preview</span>
                  </button>
                </div>

                {/* Price Display */}
                <div>
                  {course.isFree ? (
                    <div className="text-3xl font-black text-emerald-400 font-mono">FREE</div>
                  ) : (
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-3xl font-black text-white">₹{course.price}</span>
                      <span className="text-sm text-slate-500 line-through">₹{course.originalPrice}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        50% OFF
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    ⚡ Instant access · 30-day money-back guarantee
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isEnrolled ? (
                    <button
                      onClick={() => setPlayerMode(true)}
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Continue Learning</span>
                    </button>
                  ) : course.isFree ? (
                    <button
                      onClick={handleEnrollFree}
                      disabled={isEnrolling}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll in Free Course ⚡'}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openCheckout({
                          itemType: 'course',
                          itemId: course.id,
                          itemTitle: course.title,
                          price: course.price,
                        })
                      }
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <span>Buy Course Now</span>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>

                {/* Features Included List */}
                <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                  <div className="font-semibold text-white mb-2">This course includes:</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{course.totalDuration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Markdown cheat sheets & notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Downloadable source code packages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
