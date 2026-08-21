import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star, ChevronRight, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, getUnits } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';


export default function CourseUnits() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { courses, units, loading, error } = useSelector((state: RootState) => state.learning);

  useEffect(() => {
    if (courseId) {
      dispatch(getUnits(courseId));
    }
  }, [dispatch, courseId]);

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(getCourses());
    }
  }, [courses.length, dispatch]);

  const currentCourse = courses.find((course) => course.id === courseId);
  const courseProgressPct = Math.round(currentCourse?.progressPct ?? 0);
  const completedUnitCount = units.filter((unit) => unit.status === 'completed').length;

  const handleUnitClick = (e: React.MouseEvent, unitId: string, status: string, isLocked: boolean) => {
    e.preventDefault();
    if (status === 'locked' || isLocked) return;
    navigate(`/student/courses/${courseId}/units/${unitId}`);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[999px] mx-auto bg-white rounded-none md:rounded-[24px] flex flex-col font-['Outfit',sans-serif] relative shadow-sm border border-gray-100">
      {/* Content Area */}
      <div className="flex flex-col p-4 md:p-[32px] gap-6 md:gap-8">
        
        {/* Storyline Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 md:p-8 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] gap-4 md:gap-0">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#949494] font-medium tracking-wide uppercase">Current course</span>
            <h2 className="text-[28px] font-bold text-[#282828] tracking-[-0.5px]">{currentCourse?.title || 'Course units'}</h2>
          </div>
          
          <div className="flex items-center gap-4 bg-[#F8FAFC] py-3 px-4 md:px-6 rounded-[12px] w-full md:w-auto">
            <div className="relative w-[72px] h-[72px] flex items-center justify-center isolate">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72" overflow="visible">
                <circle cx="36" cy="36" r="32" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="36" cy="36" r="32" fill="none" stroke="#5C9DFF" strokeWidth="8" strokeDasharray="201" strokeDashoffset={201 - (201 * courseProgressPct) / 100} />
              </svg>
              <span className="font-['Outfit'] font-bold text-[12px] leading-[15px] text-[#282828] z-10">{courseProgressPct}%</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#282828]">Course progress</span>
              <span className="text-[13px] text-[#949494]">{completedUnitCount} of {units.length} available units completed</span>
            </div>
          </div>
        </div>

        {/* Units Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end text-center md:text-left gap-4 md:gap-0">
            <div className="flex flex-col gap-1 items-center md:items-start">
              <h3 className="text-[18px] font-bold text-[#282828]">Choose a unit</h3>
              <p className="text-[14px] text-[#949494]">
                The available units, their order, and their lock state are set by your course.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:bg-[#4F8DFB] hover:text-white hover:border-[#4F8DFB] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:bg-[#4F8DFB] hover:text-white hover:border-[#4F8DFB] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 pt-4 md:pt-2 hide-scrollbar scroll-smooth items-center md:items-stretch"
          >
            {loading && <p className="text-gray-500">Loading units...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && units.length === 0 && (
              <p className="text-gray-500">No units available.</p>
            )}
            {!loading && units.map((unit) => (
              <React.Fragment key={unit.id}>
                <div 
                  onClick={(e) => handleUnitClick(e, unit.id, unit.status, unit.isLocked)}
                  className={`flex-none w-full max-w-[320px] md:max-w-none md:w-[260px] h-[220px] rounded-[16px] p-5 flex flex-col justify-between relative transition-all duration-200 ${
                    unit.status === 'in_progress' || unit.status === 'not_started' 
                      ? 'bg-white border-[2px] border-[#4F8DFB] shadow-[0px_4px_16px_rgba(79,141,251,0.12)] cursor-pointer hover:-translate-y-1' 
                      : unit.status === 'completed'
                      ? 'bg-white border border-[#E5E7EB] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:-translate-y-1'
                      : 'bg-[#F9FAFB] border border-[#E5E7EB] opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      unit.status === 'completed' ? 'bg-[#DCFCE7]' :
                      (unit.status === 'in_progress' || unit.status === 'not_started') ? 'bg-[#EFF6FF]' : 'bg-[#E5E7EB]'
                    }`}>
                      <BookOpen className={`w-6 h-6 ${
                        unit.status === 'completed' ? 'text-[#16A34A]' :
                        (unit.status === 'in_progress' || unit.status === 'not_started') ? 'text-[#4F8DFB]' : 'text-[#9CA3AF]'
                      }`} />
                    </div>
                    
                    {unit.status === 'completed' && (
                      <span className="px-3 py-1 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold rounded-full">
                        Completed
                      </span>
                    )}
                    {(unit.status === 'in_progress' || unit.status === 'not_started') && (
                      <span className="px-3 py-1 bg-[#4F8DFB] text-white text-[11px] font-bold rounded-full">
                        {unit.status === 'not_started' ? 'Start' : 'Up Next'}
                      </span>
                    )}
                    {unit.status === 'locked' && (
                      <span className="px-3 py-1 bg-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold rounded-full">
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mt-auto">
                    <span className={`text-[13px] font-semibold ${
                      (unit.status === 'locked' || unit.isLocked) ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                    }`}>
                      Unit {unit.orderIndex}
                    </span>
                    <h4 className={`text-[18px] font-bold leading-tight ${
                      (unit.status === 'locked' || unit.isLocked) ? 'text-[#9CA3AF]' : 'text-[#282828]'
                    }`}>
                      {unit.title}
                    </h4>
                    <span className={`text-[13px] ${
                      (unit.status === 'locked' || unit.isLocked) ? 'text-[#9CA3AF]' : 'text-[#949494]'
                    }`}>
                      {unit.navigation === 'unit_activity_sequence'
                        ? `Activity sequence · ${unit.status.replace('_', ' ')}`
                        : `${unit.totalLessonCount} available items · ${unit.status.replace('_', ' ')}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4 w-full">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F3F4F6] rounded-full">
                      <Star className="w-3.5 h-3.5 text-[#6B7280]" fill={(unit.status === 'locked' || unit.isLocked) ? 'none' : '#9CA3AF'} />
                      <span className="text-[12px] font-bold text-[#6B7280]">+{Math.round(unit.progressPct)}% Mastery</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${(unit.status === 'locked' || unit.isLocked) ? 'text-[#D1D5DB]' : 'text-[#9CA3AF]'}`} />
                  </div>
                </div>

                {/* Arrow Connector (except last item) */}
                {unit.orderIndex < units.length && (
                  <div className="hidden md:flex items-center justify-center px-1">
                    <ChevronRight className="w-6 h-6 text-[#D1D5DB]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
