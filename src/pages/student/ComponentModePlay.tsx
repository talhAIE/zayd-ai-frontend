import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getLessonModes, 
  startLessonMode, 
  completeLessonMode, 
  getLessons 
} from '@/redux/slices/learningSlice';
import { 
  fetchLessonModeComponents, 
  submitComponentAttempt,
  saveComponentAttempt,
  startLearningComponent,
  LearningComponent 
} from '@/services/learningService';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';

import {
  DropdownComponent,
  MCQComponent,
  MatchComponent,
  SemanticReviewComponent,
  TrueFalseComponent,
  TextVariationComponent,
  MediaComponent,
  FlashcardsComponent,
} from '@/components/learning/modes';

export default function ComponentModePlay() {
  const { courseId, unitId, lessonId, modeId } = useParams<{
    courseId: string;
    unitId: string;
    lessonId: string;
    modeId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { modes, lessons, units } = useSelector((state: RootState) => state.learning);
  const [components, setComponents] = useState<LearningComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingMode, setIsSubmittingMode] = useState(false);
  const [completedComponentIds, setCompletedComponentIds] = useState<Set<string>>(new Set());

  const currentUnit = units.find((u) => u.id === unitId);
  const currentLesson = lessons.find((l) => l.id === lessonId);
  const currentMode = modes.find((m) => m.id === modeId);

  // Load components & initialize mode session
  useEffect(() => {
    async function loadData() {
      if (!modeId) return;
      setLoading(true);
      setError(null);
      try {
        // Attempt to start lesson mode (non-blocking if already in progress or server transient 500)
        try {
          await dispatch(startLessonMode({ lessonModeId: modeId })).unwrap();
        } catch (startErr) {
          console.warn('startLessonMode non-critical error:', startErr);
        }

        const data = await fetchLessonModeComponents(modeId);
        // Sort by orderIndex
        const sorted = [...data].sort((a, b) => a.orderIndex - b.orderIndex);
        setComponents(sorted);

        // Pre-fill completed components from attempt status
        const completedIds = new Set<string>();
        sorted.forEach((c) => {
          if (c.attempt?.status === 'completed' || c.attempt?.status === 'submitted') {
            completedIds.add(c.id);
          }
        });
        setCompletedComponentIds(completedIds);
      } catch (err: any) {
        console.error('Failed to load components:', err);
        setError(err.response?.data?.message || 'Failed to load lesson mode components.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dispatch, modeId]);

  // Handle component answer submissions
  const handleComponentSubmit = async (componentId: string, response: any) => {
    try {
      try {
        await startLearningComponent(componentId);
      } catch {
        // A component may already be started; submit remains the source of truth.
      }

      const formattedResponse =
        typeof response === 'object' && response !== null ? response : { value: response };

      const result = await submitComponentAttempt(componentId, {
        response: formattedResponse,
        finalResponse: formattedResponse,
      });

      setCompletedComponentIds((prev) => new Set([...prev, componentId]));
      toast.success('Response submitted!');
      return result;
    } catch (err: any) {
      console.error('Failed to submit component response:', err);
      toast.error(err.response?.data?.message || 'Failed to submit response.');
      throw err;
    }
  };

  const handleComponentChange = async (componentId: string, response: any) => {
    try {
      await saveComponentAttempt(componentId, { response });
    } catch {
      // Draft saving is best-effort; the final submit still validates server-side.
    }
  };

  // Complete the entire mode and progress to next mode or lesson roadmap
  const handleCompleteMode = async () => {
    if (!modeId || !lessonId) return;
    setIsSubmittingMode(true);
    try {
      await dispatch(completeLessonMode({ lessonModeId: modeId })).unwrap();
      const updatedModes = await dispatch(getLessonModes(lessonId)).unwrap();
      if (unitId) {
        dispatch(getLessons(unitId));
      }

      // Find next unlocked mode
      const nextMode = updatedModes.find(
        (m: any) => !m.isLocked && m.status !== 'completed' && m.id !== modeId
      );

      toast.success('Mode completed successfully!');

      if (nextMode) {
        if (nextMode.modeSource === 'component') {
          navigate(
            `/student/courses/${courseId}/units/${unitId}/lessons/${lessonId}/modes/${nextMode.id}`
          );
        } else if (nextMode.modeKey === 'reading-mode' || nextMode.modeKey === 'first-read-mode') {
          navigate(`/student/courses/reading-mode?lessonId=${lessonId}&modeId=${nextMode.id}`);
        } else if (nextMode.modeKey === 'roleplay-mode' || nextMode.modeKey === 'speaking-mode') {
          navigate(`/student/courses/roleplay-mode?lessonId=${lessonId}&modeId=${nextMode.id}`);
        } else if (nextMode.modeKey === 'listening-mode') {
          navigate(`/student/courses/listening-mode?lessonId=${lessonId}&modeId=${nextMode.id}`);
        } else if (nextMode.modeKey === 'debate-mode') {
          navigate(`/student/courses/debate-mode?lessonId=${lessonId}&modeId=${nextMode.id}`);
        } else {
          navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
        }
      } else {
        navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
      }
    } catch (err: any) {
      console.error('Failed to complete mode:', err);
      toast.error('Failed to complete mode.');
    } finally {
      setIsSubmittingMode(false);
    }
  };

  const completedCount = completedComponentIds.size;
  const totalCount = components.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-[1040px] mx-auto pb-16 flex flex-col gap-6 font-['Outfit',sans-serif]">
      {/* Mode Header Card with Back Button */}
      <div className="w-full bg-white rounded-none md:rounded-[20px] border border-[#E2E8F0] shadow-sm p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lessonId}`)
            }
            className="w-10 h-10 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#282828] hover:bg-gray-50 transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="Back to Lesson"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] md:text-[24px] font-extrabold text-[#0F172A] tracking-[-0.3px]">
              {currentMode?.title || 'Learning Mode'}
            </h1>
            <span className="text-[13px] font-semibold text-[#64748B]">
              {currentUnit?.title || 'Unit'}
              {currentLesson ? ` • ${currentLesson.title}` : ''}
            </span>
          </div>
        </div>

        <div className="self-start sm:self-auto px-4 py-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-full text-[13px] font-bold">
          {completedCount}/{totalCount > 0 ? totalCount : 1} activities completed
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="w-full bg-white rounded-[20px] p-12 border border-[#E2E8F0] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#4F8DFB] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#64748B] font-medium text-[14px]">Loading interactive mode components...</p>
        </div>
      )}

      {error && !loading && (
        <div className="w-full bg-red-50 rounded-[20px] p-6 border border-red-200 text-red-700 text-center">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Components List */}
      {!loading && !error && components.length === 0 && (
        <div className="w-full bg-white rounded-[20px] p-8 border border-[#E2E8F0] text-center text-[#64748B]">
          No components available in this mode.
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {components.map((comp) => {
            const isCompleted = completedComponentIds.has(comp.id);

            switch (comp.componentType) {
              case 'dropdown':
                return (
                  <DropdownComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(ans) => handleComponentChange(comp.id, ans)}
                    onSubmit={(ans) => handleComponentSubmit(comp.id, ans)}
                    isSubmitted={isCompleted}
                  />
                );

              case 'mcq':
                return (
                  <MCQComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, { selectedOption: val })}
                    onSubmit={(val) => handleComponentSubmit(comp.id, { selectedOption: val })}
                    isSubmitted={isCompleted}
                  />
                );

              case 'match_column':
                return (
                  <MatchComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(pairs) => handleComponentChange(comp.id, pairs)}
                    onSubmit={(pairs) => handleComponentSubmit(comp.id, pairs)}
                    isSubmitted={isCompleted}
                  />
                );

              case 'open_input':
                return (
                  <SemanticReviewComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, { text: val })}
                    onSubmit={(val) => handleComponentSubmit(comp.id, { text: val })}
                    isSubmitted={isCompleted}
                  />
                );

              case 'true_false':
                return (
                  <TrueFalseComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, { value: val })}
                    onSubmit={(val) => handleComponentSubmit(comp.id, { value: val })}
                    isSubmitted={isCompleted}
                  />
                );

              case 'flashcards':
                return (
                  <FlashcardsComponent
                    key={comp.id}
                    component={comp}
                    onComplete={() => setCompletedComponentIds((prev) => new Set([...prev, comp.id]))}
                  />
                );

              case 'media':
                return <MediaComponent key={comp.id} component={comp} />;

              case 'text':
              case 'text_variation':
              default:
                return <TextVariationComponent key={comp.id} component={comp} />;
            }
          })}

          {/* Bottom Progress and Action Bar matching Figma */}
          <div className="w-full bg-white rounded-[18px] border border-[#E2E8F0] shadow-sm p-4 md:px-6 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[13px] font-bold text-[#64748B]">Progress</span>
              <div className="w-full sm:w-[240px] h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4F8DFB] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[13px] font-bold text-[#0F172A] min-w-[32px]">{progressPct}%</span>
            </div>

            <button
              type="button"
              onClick={handleCompleteMode}
              disabled={isSubmittingMode}
              className={`
                w-full sm:w-auto bg-[#4F8DFB] hover:bg-[#3B82F6] active:scale-[0.98] text-white px-7 py-3 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all
                ${isSubmittingMode ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSubmittingMode ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>{isSubmittingMode ? 'Advancing...' : 'Next Activity →'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
