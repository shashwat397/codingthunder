import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Video, BookOpen, Check, ArrowRight, Zap } from 'lucide-react';
import { Course } from '../types/index.ts';
import { api } from '../services/api.ts';

interface CoursesViewProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Web Development', 'Python', 'DSA & Algorithms', 'DevOps & Cloud'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState('popular');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        search: search || undefined,
        freeOnly,
        sort,
      });
      setCourses(Array.isArray(res?.courses) ? res.courses : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, freeOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Production Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Course Catalog</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Comprehensive, project-first courses designed to teach you full-stack development, distributed architecture, and technical interview problem solving.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by keyword, topic, or technology..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-mono mr-1">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level & Free Toggle & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none cursor-pointer"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="accent-amber-500 w-3.5 h-3.5 cursor-pointer rounded"
              />
              <span>Free Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-[#0a0f19] border border-slate-800 rounded-2xl p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No courses match your filter criteria</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing your filters or searching for something else.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setFreeOnly(false);
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-all overflow-hidden flex flex-col shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-slate-700/80">
                    {course.category}
                  </span>
                </div>
                {course.isFree && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 text-slate-950 font-bold text-xs font-mono shadow-md">
                      FREE
                    </span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.totalDuration}
                    </span>
                    <span>·</span>
                    <span>{course.level}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    {course.isFree ? (
                      <span className="text-emerald-400 font-bold font-mono text-base">FREE</span>
                    ) : (
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-lg font-bold text-white">₹{course.price}</span>
                        <span className="text-xs text-slate-500 line-through">₹{course.originalPrice}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate(`/courses/${course.slug}`)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
