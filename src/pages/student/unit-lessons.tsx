import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, ClipboardList, Lock, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getCourses, getLessons, getUnits, startLesson } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { LearningLesson } from '@/services/learningService';
import { getLearningModePath, isLockedLearningItem } from '@/utils/learning-navigation';

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

export default function UnitLessons() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, units, lessons, loading, error } = useSelector((state: RootState) => state.learning);

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
            <h2 className="text-xl font-bold text-[#282828]">Unit lessons</h2>
            <p className="mt-1 text-sm text-[#64748B]">Only content published by your teacher is shown here.</p>
          </div>

          {loading && <p className="py-8 text-center text-[#64748B]">Loading unit lessons…</p>}
          {error && <p className="py-8 text-center text-red-600">{error}</p>}
          {!loading && !error && cards.length === 0 && (
            <p className="py-8 text-center text-[#64748B]">No learner lessons are published for this unit.</p>
          )}

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
        </section>
      </div>
    </div>
  );
}
