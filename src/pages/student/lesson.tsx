import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  BookOpen, 
  Headphones, 
  Users, 
  ChevronRight, 
  Play, 
  Sparkles, 
  BookMarked, 
  HelpCircle, 
  PenTool, 
  Star, 
  Lightbulb, 
  Award, 
  GraduationCap, 
  BookCheck,
  FileSearch,
  MessageSquare
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLessonModes, startLesson, startLessonMode, getLessons, getUnits } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';
import { LearningLessonMode } from '@/services/learningService';
import { getLearningModePath, isLockedLearningItem } from '@/utils/learning-navigation';
import AskZaydAiPopup from '@/components/learning/AskZaydAiPopup';

export default function Lesson() {
  const { courseId, unitId, lessonId } = useParams<{ courseId: string; unitId: string; lessonId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { modes, loading, error, lessons, units } = useSelector((state: RootState) => state.learning);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const directLaunchId = useRef<string | null>(null);

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
    if (lessonId) {
      dispatch(getLessonModes(lessonId));
      dispatch(startLesson(lessonId));
    }
  }, [dispatch, lessonId]);

  const currentLesson = lessons.find((l) => l.id === lessonId);
  const currentUnit = units.find((u) => u.id === unitId);

  useEffect(() => {
    if (
      !courseId ||
      !unitId ||
      !lessonId ||
      !currentLesson ||
      currentLesson.launchBehavior !== 'direct_mode' ||
      !currentLesson.directLaunchMode ||
      isLockedLearningItem(currentLesson) ||
      directLaunchId.current === lessonId
    ) {
      return;
    }

    directLaunchId.current = lessonId;
    navigate(getLearningModePath(
      { courseId, unitId, lessonId },
      currentLesson.directLaunchMode,
    ), { replace: true });
  }, [courseId, currentLesson, lessonId, navigate, unitId]);

  // Dynamic progress stats
  const completedModes = modes.filter((m) => m.status === 'completed');
  const completedCount = currentLesson?.completedRequiredModeCount ?? completedModes.length;
  const totalRequiredCount = currentLesson?.requiredModeCount ?? modes.filter((m) => m.isRequired).length;
  const totalCount = totalRequiredCount > 0 ? totalRequiredCount : (modes.length > 0 ? modes.length : 1);
  const lessonProgressPct = currentLesson?.progressPct !== undefined && currentLesson.progressPct !== null
    ? Math.round(currentLesson.progressPct)
    : (modes.length > 0 ? Math.round((completedModes.length / modes.length) * 100) : 0);

  const getIconForMode = (modeKey: string) => {
    switch (modeKey) {
      case 'objectives-introduction-mode':
        return <Star className="w-6 h-6 text-amber-500" />;
      case 'vocabulary-mode':
        return <BookMarked className="w-6 h-6 text-indigo-500" />;
      case 'first-read-mode':
      case 'reading-mode':
        return <BookOpen className="w-6 h-6 text-sky-500" />;
      case 'skill-mode':
        return <Sparkles className="w-6 h-6 text-violet-500" />;
      case 'close-read-mode':
        return <FileSearch className="w-6 h-6 text-teal-500" />;
      case 'grammar-mode':
        return <BookCheck className="w-6 h-6 text-emerald-500" />;
      case 'speaking-mode':
      case 'roleplay-mode':
        return <Users className="w-6 h-6 text-orange-400" />;
      case 'listening-mode':
        return <Headphones className="w-6 h-6 text-purple-500" />;
      case 'debate-mode':
        return <MessageSquare className="w-6 h-6 text-rose-500" />;
      case 'quiz-mode':
      case 'check-understanding-mode':
        return <HelpCircle className="w-6 h-6 text-blue-500" />;
      case 'writing-mode':
        return <PenTool className="w-6 h-6 text-pink-500" />;
      case 'unit-overview-mode':
        return <Lightbulb className="w-6 h-6 text-amber-500" />;
      case 'project-mode':
        return <Award className="w-6 h-6 text-indigo-500" />;
      case 'assessment-mode':
        return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      default:
        return <Target className="w-6 h-6 text-emerald-500" />;
    }
  };

  const getIconBgForMode = (modeKey: string, isCompleted: boolean, isLocked: boolean) => {
    if (isCompleted) return 'bg-emerald-50';
    if (isLocked) return 'bg-gray-100';
    switch (modeKey) {
      case 'objectives-introduction-mode': return 'bg-amber-50';
      case 'vocabulary-mode': return 'bg-indigo-50';
      case 'first-read-mode':
      case 'reading-mode': return 'bg-sky-50';
      case 'skill-mode': return 'bg-violet-50';
      case 'close-read-mode': return 'bg-teal-50';
      case 'grammar-mode': return 'bg-emerald-50';
      case 'speaking-mode':
      case 'roleplay-mode': return 'bg-orange-50';
      case 'listening-mode': return 'bg-purple-50';
      case 'debate-mode': return 'bg-rose-50';
      case 'quiz-mode':
      case 'check-understanding-mode': return 'bg-blue-50';
      case 'writing-mode': return 'bg-pink-50';
      default: return 'bg-blue-50';
    }
  };

  const handleModeClick = async (mode: LearningLessonMode) => {
    if (isLockedLearningItem(mode)) {
      toast.error('This mode is locked. Complete earlier required modes first.');
      return;
    }

    try {
      await dispatch(startLessonMode({ lessonModeId: mode.id })).unwrap();
    } catch (err) {
      console.error('Failed to start lesson mode:', err);
    }
    
    if (courseId && unitId && lessonId) {
      navigate(getLearningModePath({ courseId, unitId, lessonId }, mode));
    }
  };

  if (
    currentLesson?.launchBehavior === 'direct_mode' &&
    currentLesson.directLaunchMode &&
    isLockedLearningItem(currentLesson)
  ) {
    return (
      <div className="w-full max-w-[1087px] mx-auto bg-white rounded-[24px] border border-gray-100 p-8 text-center font-['Outfit',sans-serif]">
        <h1 className="text-xl font-bold text-[#282828]">This activity is locked</h1>
        <p className="mt-2 text-[#64748B]">Complete the earlier required activity to unlock it.</p>
      </div>
    );
  }

  if (currentLesson?.launchBehavior === 'direct_mode' && currentLesson.directLaunchMode) {
    return (
      <div className="w-full max-w-[1087px] mx-auto bg-white rounded-[24px] border border-gray-100 p-8 text-center font-['Outfit',sans-serif]">
        <p className="text-[#64748B]">Opening activity…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1087px] mx-auto bg-[#FAFAFA] md:bg-white rounded-none md:rounded-[24px] flex flex-col font-['Outfit',sans-serif] relative border-0 md:border md:border-gray-100 shadow-sm overflow-hidden">

      <div className="flex flex-col p-4 md:p-[32px] gap-6 md:gap-8 bg-[#F9FAFB] md:bg-white h-full flex-grow">
        
        {/* Storyline Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 md:p-8 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] gap-4 md:gap-0">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#949494] font-semibold tracking-wider uppercase">
              {currentUnit?.title || 'Course Unit'}
            </span>
            <h2 className="text-[28px] font-bold text-[#282828] tracking-[-0.5px]">
              {currentLesson?.title || 'Lesson Modes'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-[#F8FAFC] py-3 px-6 rounded-[12px] w-full md:w-auto flex-shrink-0">
            <div className="relative w-[72px] h-[72px] flex items-center justify-center isolate flex-shrink-0">
              <div className="absolute inset-1 bg-white rounded-full shadow-sm"></div>
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
                  strokeDashoffset={201 - (201 * lessonProgressPct) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-['Outfit'] font-bold text-[13px] text-[#282828] z-10">
                {lessonProgressPct}%
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#282828]">Lesson Mastery</span>
              <span className="text-[13px] text-[#949494]">
                {completedCount} of {totalCount} {totalCount === 1 ? 'activity' : 'activities'} completed
              </span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-bold text-[#282828]">Lesson Modes</h3>
              <p className="text-[14px] text-[#949494]">
                Complete all required modes in sequence to master this lesson.
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex p-1 bg-[#F3F4F6] rounded-full">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#4F8DFB] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#282828]'
                }`}
              >
                <LayoutGridIcon className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'timeline' ? 'bg-[#4F8DFB] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#282828]'
                }`}
              >
                <TimelineIcon className="w-4 h-4" /> Timeline
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-[13px] font-semibold">
              <span className="text-[#6B7280]">Overall Lesson Progress</span>
              <span className="text-[12px] font-bold text-[#4F8DFB]">+{lessonProgressPct}% Mastery</span>
            </div>
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4F8DFB] rounded-full transition-all duration-500" 
                style={{ width: `${lessonProgressPct}%` }}
              />
            </div>
          </div>

          {/* Cards Content */}
          <div className={`mt-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4' : 'flex flex-row overflow-x-auto pb-1 pt-2 px-1 gap-4 hide-scrollbar items-center'}`}>
            {loading && <p className="text-gray-500 py-4">Loading lesson modes...</p>}
            {error && <p className="text-red-500 py-4">{error}</p>}
            {!loading && !error && modes.length === 0 && (
              <p className="text-gray-500 py-4">No lesson modes available for this lesson.</p>
            )}
            {!loading && modes.map((mode, idx) => (
              <React.Fragment key={mode.id}>
                <div 
                  onClick={() => handleModeClick(mode)}
                  className={`
                    flex flex-col justify-between p-5 bg-white rounded-[16px] transition-all duration-200 flex-none
                    ${viewMode === 'timeline' ? 'w-[240px] min-h-[240px]' : 'h-full min-h-[240px]'}
                    ${(!mode.isLocked && mode.status !== 'locked') 
                      ? 'border-2 border-transparent hover:border-[#4F8DFB] ring-1 ring-[#E5E7EB] hover:ring-[#4F8DFB] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0px_4px_16px_rgba(79,141,251,0.12)] cursor-pointer' 
                      : 'border-2 border-transparent ring-1 ring-[#E5E7EB] opacity-70 cursor-not-allowed'}
                  `}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-[14px] font-semibold text-[#9CA3AF]">{String(mode.orderIndex || idx + 1).padStart(2, '0')}</span>
                    
                    {mode.status === 'completed' && (
                      <span className="px-3 py-1 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold rounded-full">
                        Completed
                      </span>
                    )}
                    {(mode.status === 'in_progress' || mode.status === 'not_started') && !mode.isLocked && (
                      <span className="px-3 py-1 bg-[#EFF6FF] text-[#4F8DFB] text-[11px] font-bold rounded-full">
                        {mode.status === 'not_started' ? 'Start' : 'Resume'}
                      </span>
                    )}
                    {(mode.isLocked || mode.status === 'locked') && (
                      <span className="px-3 py-1 bg-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold rounded-full">
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3 my-auto w-full">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      getIconBgForMode(mode.modeKey, mode.status === 'completed', mode.isLocked || mode.status === 'locked')
                    }`}>
                      {getIconForMode(mode.modeKey)}
                    </div>
                    <div className="flex flex-col items-center text-center px-2">
                      <h4 className={`text-[16px] font-bold leading-tight ${
                        (mode.isLocked || mode.status === 'locked') ? 'text-[#9CA3AF]' : 'text-[#282828]'
                      }`}>{mode.title}</h4>
                      <span className="text-[12px] text-[#949494] mt-1 line-clamp-2">
                        {mode.description || mode.modeKey.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full mt-2">
                    <div className={`px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                      (mode.isLocked || mode.status === 'locked') ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {mode.isRequired ? 'Required' : 'Optional'}
                    </div>
                    {(!mode.isLocked && mode.status !== 'locked') && (
                      <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#4F8DFB] hover:text-white transition-colors text-[#9CA3AF]">
                        <Play className="w-4 h-4 ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'timeline' && idx < modes.length - 1 && (
                  <div className="flex-none px-2 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-[#D1D5DB]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
      <AskZaydAiPopup
        unitId={unitId}
        unitTitle={currentUnit?.title || 'Lesson Modes'}
        launchLessonId={lessonId}
        launcherPlacement="lesson_modes"
      />
    </div>
  );
}

// Custom icons for the toggle
function LayoutGridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function TimelineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

