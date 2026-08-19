import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, getUnits, getLessons } from '@/redux/slices/learningSlice';
import { fetchDashboardData } from '@/redux/slices/dashboardSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';

export default function UnitLessons() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { courses, units, lessons, loading, error } = useSelector((state: RootState) => state.learning);
  const { user } = useSelector((state: RootState) => state.auth);
  const dashboardData = useSelector((state: RootState) => state.dashboard.data);

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch, courses.length]);

  useEffect(() => {
    if (courseId && units.length === 0) {
      dispatch(getUnits(courseId));
    }
  }, [dispatch, courseId, units.length]);

  useEffect(() => {
    if (unitId) {
      dispatch(getLessons(unitId));
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    if (!dashboardData && user?.id) {
      dispatch(fetchDashboardData({ userId: user.id }));
    }
  }, [dispatch, dashboardData, user?.id]);

  const currentCourse = courses.find((c) => c.id === courseId);
  const currentUnit = units.find((u) => u.id === unitId);

  // Derive stats
  const completedLessons = lessons.filter((l) => l.status === 'completed');
  const completedCount = completedLessons.length;
  const totalCount = lessons.length;
  const progressPct = currentUnit?.progressPct !== undefined && currentUnit.progressPct !== null
    ? Math.round(currentUnit.progressPct)
    : (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

  const handleOverviewClick = () => {
    navigate(`/student/courses/${courseId}/units/${unitId}/overview`);
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.status === 'locked' || lesson.isLocked) {
      toast.error('This lesson is locked. Complete earlier lessons first.');
      return;
    }
    navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lesson.id}`);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // User details
  const userName = user?.name || user?.username || 'Student';
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'ST');

  const streakDays = dashboardData?.streak ?? 0;

  return (
    <div className="w-full max-w-[1087px] mx-auto flex flex-col gap-5 font-['Outfit',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-2 md:px-0">
        <button
          onClick={() => navigate(`/student/courses/${courseId}`)}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#282828] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          title="Back to Course Units"
        >
          <ChevronLeft className="w-5 h-5 text-[#282828]" />
        </button>

        <h1 className="text-[20px] md:text-[22px] font-bold text-[#282828]">
          {currentUnit?.title || 'Unit'}
        </h1>

        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] font-bold text-[13px]">
            <span>🔥</span>
            <span>{streakDays} Day{streakDays === 1 ? '' : 's'}</span>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00BFA5] text-white flex items-center justify-center font-bold text-[12px]">
              {userInitials}
            </div>
            <span className="font-bold text-[#282828] text-[14px] hidden sm:inline">
              {userName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full bg-white rounded-none md:rounded-[24px] flex flex-col relative shadow-sm border border-gray-100 p-4 md:p-[32px] gap-6 md:gap-8">
        
        {/* Storyline / Unit Overview Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 md:p-8 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] gap-4 md:gap-0">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="text-[12px] md:text-[13px] text-[#949494] font-semibold tracking-wider uppercase">
              {currentCourse ? currentCourse.title : 'COURSE UNIT'}
            </span>
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#282828] tracking-[-0.5px]">
              {currentUnit?.title || 'Unit Overview'}
            </h2>
            {currentUnit?.description && (
              <p className="text-[14px] text-[#6B7280] mt-0.5 line-clamp-2">
                {currentUnit.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4 bg-[#F8FAFC] py-3 px-4 md:px-6 rounded-[12px] w-full md:w-auto flex-shrink-0">
            <div className="relative w-[72px] h-[72px] flex items-center justify-center isolate flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72" overflow="visible">
                <circle cx="36" cy="36" r="32" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle 
                  cx="36" 
                  cy="36" 
                  r="32" 
                  fill="none" 
                  stroke="#5C9DFF" 
                  strokeWidth="8" 
                  strokeDasharray="201" 
                  strokeDashoffset={201 - (201 * progressPct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-['Outfit'] font-bold text-[14px] text-[#282828] z-10">
                {progressPct}%
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#282828]">Unit Mastery</span>
              <span className="text-[13px] text-[#949494]">
                {completedCount} of {totalCount} lesson{totalCount === 1 ? '' : 's'} completed
              </span>
            </div>
          </div>
        </div>

        {/* Section Header & Progress Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#282828]">Lesson Activities</h3>
              <p className="text-[14px] text-[#949494]">
                Complete the lessons in sequence to master this unit.
              </p>
            </div>

            {/* Carousel Controls */}
            {lessons.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:bg-[#4F8DFB] hover:text-white hover:border-[#4F8DFB] transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:bg-[#4F8DFB] hover:text-white hover:border-[#4F8DFB] transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-medium text-[#6B7280]">Progress</span>
              <span className="font-bold text-[#5C9DFF]">{progressPct}% Complete</span>
            </div>
            <div className="w-full h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5C9DFF] rounded-full transition-all duration-500" 
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Cards Flow */}
        <div 
          ref={scrollRef}
          className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth items-center md:items-stretch"
        >
          {error && <p className="text-red-500 py-4">{error}</p>}
          {!loading && !error && lessons.length === 0 && (
            <p className="text-gray-500 py-4">No lessons found for this unit.</p>
          )}

          {/* Unit Overview Card */}
          <div 
            onClick={handleOverviewClick}
            className="flex-none w-full max-w-[320px] md:max-w-none md:w-[255px] h-[260px] bg-white border border-[#E5E7EB] rounded-[20px] p-5 flex flex-col justify-between shadow-[0px_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer relative group"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-11 h-11 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                <Menu className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold rounded-full">
                Overview
              </span>
            </div>

            <div className="flex flex-col gap-1 my-auto">
              <span className="text-[12px] font-medium text-[#949494] uppercase tracking-wider">
                Unit Overview
              </span>
              <h4 className="text-[20px] font-bold text-[#282828] leading-tight group-hover:text-[#4F8DFB] transition-colors">
                {currentUnit?.title || 'Unit Overview'}
              </h4>
              <span className="text-[13px] text-[#949494] mt-0.5">
                {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex justify-between items-center w-full pt-2">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280]">
                <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
                <span>Introduction</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#4F8DFB] group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Arrow Divider after Overview */}
          {lessons.length > 0 && (
            <div className="hidden md:flex items-center justify-center flex-shrink-0 text-[#D1D5DB]">
              <ChevronRight className="w-5 h-5" />
            </div>
          )}

          {/* Sequential Lesson Cards */}
          {lessons.map((lesson, index) => (
            <React.Fragment key={lesson.id}>
              <div
                onClick={() => handleLessonClick(lesson)}
                className={`flex-none w-full max-w-[320px] md:max-w-none md:w-[255px] h-[260px] rounded-[20px] p-5 flex flex-col justify-between shadow-[0px_2px_8px_rgba(0,0,0,0.03)] transition-all relative ${
                  lesson.isLocked || lesson.status === 'locked'
                    ? 'bg-[#F9FAFB] border border-[#E5E7EB] opacity-70 cursor-not-allowed'
                    : lesson.status === 'in_progress'
                    ? 'bg-white border-[2px] border-[#4F8DFB] shadow-[0px_4px_16px_rgba(79,141,251,0.12)] cursor-pointer hover:-translate-y-1'
                    : 'bg-white border border-[#E5E7EB] cursor-pointer hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[14px] font-medium text-[#9CA3AF]">
                    {String(lesson.orderIndex || index + 1).padStart(2, '0')}
                  </span>
                  {lesson.status === 'completed' && (
                    <span className="px-3 py-1 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold rounded-full">
                      Completed
                    </span>
                  )}
                  {lesson.status === 'in_progress' && (
                    <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold rounded-full">
                      In Progress
                    </span>
                  )}
                  {lesson.status === 'not_started' && (
                    <span className="px-3 py-1 bg-[#4F8DFB] text-white text-[11px] font-bold rounded-full">
                      Start
                    </span>
                  )}
                  {(lesson.status === 'locked' || lesson.isLocked) && (
                    <span className="px-3 py-1 bg-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold rounded-full">
                      Locked
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center my-auto w-full text-center px-1">
                  {/* Bullseye / Target Icon with Green Radiating Glow */}
                  <div className="relative w-14 h-14 rounded-full bg-[#E8F8F0] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#C8F0DC] flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#10B981]" />
                    </div>
                  </div>
                  <h4 className="text-[18px] font-bold text-[#282828] mt-3 leading-tight">
                    Lesson {lesson.orderIndex || index + 1}
                  </h4>
                  <span className="text-[13px] text-[#949494] mt-0.5 line-clamp-1">
                    {lesson.title}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full pt-2">
                  <span className="px-2.5 py-0.5 bg-[#F3F4F6] text-[#4B5563] text-[11px] font-semibold rounded-full capitalize">
                    {lesson.lessonType ? lesson.lessonType.replace('_', ' ') : 'Standard'}
                  </span>
                  <div className="flex items-center gap-1 text-[12px] font-semibold text-[#6B7280]">
                    <span>{Math.round(lesson.progressPct || 0)}%</span>
                  </div>
                </div>
              </div>

              {/* Arrow Connector (except after last lesson) */}
              {index < lessons.length - 1 && (
                <div className="hidden md:flex items-center justify-center flex-shrink-0 text-[#D1D5DB]">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
}

