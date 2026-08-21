import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, TriangleAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getCourses, getLessons, getUnits, startLesson } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { getLearningModePath, isLockedLearningItem } from '@/utils/learning-navigation';

/**
 * Compatibility route for older links. It deliberately contains no curriculum
 * copy and no completion action: a published overview is just a real backend
 * lesson and is played through the normal lesson/mode experience.
 */
export default function UnitOverview() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const launchedLessonId = useRef<string | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const { courses, units, lessons } = useSelector((state: RootState) => state.learning);

  useEffect(() => {
    if (courses.length === 0) dispatch(getCourses());
  }, [courses.length, dispatch]);

  useEffect(() => {
    if (courseId && !units.some((unit) => unit.courseId === courseId)) {
      dispatch(getUnits(courseId));
    }
  }, [courseId, dispatch, units]);

  useEffect(() => {
    if (!unitId) {
      setIsLoadingOverview(false);
      return;
    }

    setIsLoadingOverview(true);
    setLaunchError(null);
    dispatch(getLessons(unitId))
      .unwrap()
      .catch(() => setLaunchError('Unable to load this unit overview.'))
      .finally(() => setIsLoadingOverview(false));
  }, [dispatch, unitId]);

  const currentCourse = courses.find((course) => course.id === courseId);
  const currentUnit = units.find((unit) => unit.id === unitId);
  const overviewLesson = lessons.find((lesson) => lesson.lessonType === 'unit_overview');

  useEffect(() => {
    if (
      !courseId ||
      !unitId ||
      !overviewLesson ||
      launchedLessonId.current === overviewLesson.id ||
      isLockedLearningItem(overviewLesson)
    ) {
      return;
    }

    launchedLessonId.current = overviewLesson.id;
    const openOverview = async (): Promise<void> => {
      try {
        await dispatch(startLesson(overviewLesson.id)).unwrap();
        if (overviewLesson.launchBehavior === 'direct_mode' && overviewLesson.directLaunchMode) {
          navigate(
            getLearningModePath(
              { courseId, unitId, lessonId: overviewLesson.id },
              overviewLesson.directLaunchMode,
            ),
            { replace: true },
          );
          return;
        }

        navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${overviewLesson.id}`, { replace: true });
      } catch (startError) {
        launchedLessonId.current = null;
        const message = typeof startError === 'string' ? startError : 'Unable to open this unit overview.';
        setLaunchError(message);
        toast.error(message);
      }
    };

    void openOverview();
  }, [courseId, dispatch, navigate, overviewLesson, unitId]);

  const backToUnit = (): void => navigate(`/student/courses/${courseId}/units/${unitId}`);

  if (isLoadingOverview) {
    return (
      <OverviewFrame title={currentUnit?.title || 'Unit overview'} onBack={backToUnit}>
        <p className="py-10 text-center text-[#64748B]">Loading the published unit overview…</p>
      </OverviewFrame>
    );
  }

  if (launchError) {
    return (
      <OverviewFrame title={currentUnit?.title || 'Unit overview'} onBack={backToUnit}>
        <div className="py-10 text-center">
          <TriangleAlert className="mx-auto h-8 w-8 text-amber-500" />
          <p className="mt-3 font-semibold text-[#282828]">{launchError}</p>
          <button type="button" onClick={backToUnit} className="mt-5 rounded-lg bg-[#4F8DFB] px-4 py-2 text-sm font-bold text-white">
            Back to unit
          </button>
        </div>
      </OverviewFrame>
    );
  }

  if (!overviewLesson) {
    return (
      <OverviewFrame title={currentUnit?.title || 'Unit overview'} onBack={backToUnit}>
        <div className="py-10 text-center">
          <TriangleAlert className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <h1 className="mt-3 text-xl font-bold text-[#282828]">No Unit Overview is published</h1>
          <p className="mt-2 text-sm text-[#64748B]">This unit does not currently have learner-facing overview content.</p>
        </div>
      </OverviewFrame>
    );
  }

  if (isLockedLearningItem(overviewLesson)) {
    return (
      <OverviewFrame title={currentUnit?.title || 'Unit overview'} onBack={backToUnit}>
        <div className="py-10 text-center">
          <Lock className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <h1 className="mt-3 text-xl font-bold text-[#282828]">This Unit Overview is locked</h1>
          <p className="mt-2 text-sm text-[#64748B]">Complete the earlier required activity to unlock it.</p>
        </div>
      </OverviewFrame>
    );
  }

  return (
    <OverviewFrame title={currentCourse?.title || currentUnit?.title || 'Unit overview'} onBack={backToUnit}>
      <p className="py-10 text-center text-[#64748B]">Opening the published Unit Overview…</p>
    </OverviewFrame>
  );
}

function OverviewFrame({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="w-full max-w-[1037px] mx-auto bg-white rounded-[24px] border border-gray-100 p-4 md:p-8 font-['Outfit',sans-serif] shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#282828] hover:bg-gray-50"
          title="Back to Unit"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-[20px] text-[#282828]">{title}</h1>
      </div>
      {children}
    </div>
  );
}
