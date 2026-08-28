import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookCheck, BookOpen, ChevronLeft, ChevronRight, ClipboardList, Headphones, LayoutGrid, Lock, PenTool, Play, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getCourses, getLessons, getUnits, startLesson } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { LearningLesson } from '@/services/learningService';
import { getLearningModePath, isLockedLearningItem } from '@/utils/learning-navigation';
import AskZaydAiPopup from '@/components/learning/AskZaydAiPopup';

const lessonTypeLabel = (lessonType: string): string => {
  switch (lessonType) {
    case 'unit_overview':
      return 'Unit Overview';
    case 'unit_project':
      return 'Project';
    case 'unit_assessment':
      return 'Assessment';
    default:
      return 'Lesson';
  }
};

const saudiLessonIcon = (modeKey: string, locked: boolean) => {
  const className = `w-6 h-6 ${locked ? 'text-[#94A3B8]' : 'text-[#4F8DFB]'}`;
  switch (modeKey) {
    case 'grammar-mode':
      return <BookCheck className={className} />;
    case 'listening-mode':
      return <Headphones className={className} />;
    case 'roleplay-mode':
      return <Users className={className} />;
    case 'writing-mode':
      return <PenTool className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};

export default function UnitLessons() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, units, lessons, loading, error } = useSelector((state: RootState) => state.learning);
  const [saudiViewMode, setSaudiViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    if (courses.length === 0) dispatch(getCourses());
  }, [courses.length, dispatch]);

  useEffect(() => {
    if (courseId && !units.some((unit) => unit.courseId === courseId)) {
      dispatch(getUnits(courseId));
    }
  }, [courseId, dispatch, units]);

  useEffect(() => {
    if (unitId) dispatch(getLessons(unitId));
  }, [dispatch, unitId]);

  const currentCourse = courses.find((course) => course.id === courseId);
  const currentUnit = units.find((unit) => unit.id === unitId);
  const completedCount = lessons.filter((lesson) => lesson.status === 'completed').length;
  const progressPct = Math.round(currentUnit?.progressPct ?? 0);
  const isSaudiUnit = currentUnit?.curriculum === 'saudi' || currentCourse?.curriculum === 'saudi';

  const openLesson = async (lesson: LearningLesson): Promise<void> => {
    if (!courseId || !unitId) return;

    if (isLockedLearningItem(lesson)) {
      toast.error('This lesson is locked. Complete the earlier required lesson first.');
      return;
    }

    try {
      await dispatch(startLesson(lesson.id)).unwrap();
      if (lesson.launchBehavior === 'direct_mode' && lesson.directLaunchMode) {
        navigate(getLearningModePath({ courseId, unitId, lessonId: lesson.id }, lesson.directLaunchMode));
        return;
      }

      navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lesson.id}`);
    } catch (startError) {
      toast.error(typeof startError === 'string' ? startError : 'Unable to open this lesson.');
    }
  };

  // The backend owns the published lesson order and locking state. Saudi units
  // now use this same lesson-first screen instead of an activity container.
  const cards = lessons;

  return (
    <div className="w-full max-w-[1087px] mx-auto flex flex-col gap-5 font-['Outfit',sans-serif]">
      <div className="flex items-center gap-3 px-2 md:px-0">
        <button
          onClick={() => navigate(`/student/courses/${courseId}`)}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#282828] hover:bg-gray-50"
          title="Back to Course Units"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#949494]">{currentCourse?.title || 'Course unit'}</p>
          <h1 className="text-[22px] font-bold text-[#282828]">{currentUnit?.title || 'Unit'}</h1>
        </div>
      </div>

      <div className="w-full bg-white rounded-[24px] border border-gray-100 p-4 md:p-8 space-y-7 shadow-sm">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-[16px] border border-[#E5E7EB] p-5 md:p-7">
          <div>
            <p className="text-sm text-[#64748B]">{currentUnit?.description || 'Complete the available lessons in the order set by your course.'}</p>
            <h2 className="mt-2 text-2xl font-bold text-[#282828]">Unit progress</h2>
          </div>
          <div className="min-w-[180px]">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-[#64748B]">Mastery</span>
              <span className="text-[#2563EB]">{progressPct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full rounded-full bg-[#4F8DFB] transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#949494]">{completedCount} of {lessons.length} available lessons completed</p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#282828]">{isSaudiUnit ? 'Lesson activities' : 'Unit lessons'}</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  {isSaudiUnit
                    ? 'Complete each lesson activity in order to unlock the next one.'
                    : 'Only content published by your teacher is shown here.'}
                </p>
              </div>
              {isSaudiUnit && (
                <div className="flex rounded-full bg-[#F3F4F6] p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSaudiViewMode('grid')}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${saudiViewMode === 'grid' ? 'bg-[#4F8DFB] text-white' : 'text-[#64748B]'}`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" /> Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaudiViewMode('timeline')}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${saudiViewMode === 'timeline' ? 'bg-[#4F8DFB] text-white' : 'text-[#64748B]'}`}
                  >
                    <Play className="h-3.5 w-3.5" /> Timeline
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading && <p className="py-8 text-center text-[#64748B]">Loading unit lessons…</p>}
          {error && <p className="py-8 text-center text-red-600">{error}</p>}
          {!loading && !error && cards.length === 0 && (
            <p className="py-8 text-center text-[#64748B]">No learner lessons are published for this unit.</p>
          )}

          {isSaudiUnit ? (
            <>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div className="h-full rounded-full bg-[#4F8DFB] transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <div className={saudiViewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4' : 'flex items-stretch gap-3 overflow-x-auto pb-3'}>
                {cards.map((lesson, index) => {
                  const locked = isLockedLearningItem(lesson);
                  const mode = lesson.directLaunchMode;
                  return (
                    <Fragment key={lesson.id}>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => openLesson(lesson)}
                        className={`min-h-[224px] rounded-[16px] border p-4 text-left flex flex-col justify-between transition-all ${
                          saudiViewMode === 'timeline' ? 'w-[228px] flex-none' : ''
                        } ${locked
                          ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed'
                          : 'border-[#4F8DFB] bg-white hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-semibold text-[#94A3B8]">{String(index + 1).padStart(2, '0')}</span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${locked ? 'bg-[#E5E7EB]' : lesson.status === 'completed' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
                            {locked ? 'Locked' : lesson.status === 'completed' ? 'Completed' : lesson.status === 'in_progress' ? 'Resume' : 'Start'}
                          </span>
                        </div>
                        <div className="my-auto">
                          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${locked ? 'bg-[#E5E7EB]' : 'bg-[#EFF6FF]'}`}>
                            {locked ? <Lock className="h-5 w-5 text-[#94A3B8]" /> : saudiLessonIcon(mode?.modeKey ?? '', false)}
                          </div>
                          <h3 className={`text-[16px] font-bold leading-tight ${locked ? 'text-[#9CA3AF]' : 'text-[#282828]'}`}>{lesson.title}</h3>
                          <p className="mt-1 text-xs font-medium text-[#4F8DFB]">{mode?.title || 'Activity'}</p>
                          {lesson.description && <p className="mt-2 line-clamp-2 text-xs text-[#64748B]">{lesson.description}</p>}
                        </div>
                        <div className="flex items-center justify-between pt-3 text-xs font-semibold text-[#64748B]">
                          <span>{Math.round(lesson.progressPct)}% complete</span>
                          {!locked && <Play className="h-4 w-4 fill-current text-[#4F8DFB]" />}
                        </div>
                      </button>
                      {saudiViewMode === 'timeline' && index < cards.length - 1 && (
                        <ChevronRight className="my-auto h-5 w-5 flex-none text-[#CBD5E1]" />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {cards.map((lesson, index) => {
                const locked = isLockedLearningItem(lesson);
                const isOverview = lesson.lessonType === 'unit_overview';
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    disabled={locked}
                    onClick={() => openLesson(lesson)}
                    className={`min-h-[220px] rounded-[18px] border p-5 text-left flex flex-col justify-between transition-all ${
                      locked
                        ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed'
                        : 'border-[#E5E7EB] bg-white hover:border-[#4F8DFB] hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${locked ? 'bg-[#E5E7EB]' : isOverview ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#2563EB]'}`}>
                        {locked ? <Lock className="w-5 h-5" /> : isOverview ? <ClipboardList className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${locked ? 'bg-[#E5E7EB]' : lesson.status === 'completed' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
                        {locked ? 'Locked' : lesson.status === 'completed' ? 'Completed' : lesson.status === 'in_progress' ? 'Resume' : 'Start'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#949494]">{lessonTypeLabel(lesson.lessonType)} {lesson.lessonType === 'standard' ? index + 1 : ''}</p>
                      <h3 className="mt-2 text-lg font-bold text-[#282828]">{lesson.title}</h3>
                      {lesson.description && <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{lesson.description}</p>}
                    </div>
                    <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                      <span>{Math.round(lesson.progressPct)}% complete</span>
                      {!locked && <Play className="w-4 h-4 fill-current" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Ask Zayd AI Tutor Popup & Sidebar */}
      <AskZaydAiPopup
        unitId={unitId}
        unitTitle={currentUnit?.title || 'Unit Lessons'}
        courseTitle={currentCourse?.title}
      />
    </div>
  );
}
